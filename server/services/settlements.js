const paise = (value) => {
  const amount = Math.round(Number(value) * 100);

  if (value == null || !Number.isSafeInteger(amount) || amount < 0) {
    throw new Error("સોદામાં રકમ અમાન્ય છે.");
  }

  return amount;
};

export function makePayment(body, userId, now = new Date()) {
  const { side, method, date, key } = body;

  if (
    body.historyComplete != null &&
    typeof body.historyComplete !== "boolean"
  ) {
    throw new Error("ઇતિહાસની ખાતરી અમાન્ય છે.");
  }

  const historyComplete = body.historyComplete === true;
  const amount = String(body.amount ?? "").trim();

  if (!["trader", "farmer"].includes(side)) {
    throw new Error("ચુકવણીનો પ્રકાર પસંદ કરો.");
  }

  if (!["cash", "upi", "bank"].includes(method)) {
    throw new Error("ચુકવણીની રીત પસંદ કરો.");
  }

  if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    throw new Error("રકમમાં વધુમાં વધુ બે દશાંશ રાખો.");
  }

  const [whole, fraction = ""] = amount.split(".");
  const amountPaise = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));

  if (
    !Number.isSafeInteger(amountPaise) ||
    amountPaise < 0 ||
    (amountPaise === 0 && !historyComplete)
  ) {
    throw new Error(
      "રકમ શૂન્ય કરતાં વધુ રાખો; શૂન્ય માટે જૂના ઇતિહાસની ખાતરી જરૂરી છે.",
    );
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const part = (name) => parts.find((item) => item.type === name).value;

  const today = `${part("year")}-${part("month")}-${part("day")}`;

  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date ||
    date > today
  ) {
    throw new Error("ચુકવણીની સાચી તારીખ આપો.");
  }

  if (typeof key !== "string" || !/^[A-Za-z0-9_-]{8,100}$/.test(key)) {
    throw new Error("ચુકવણીનો ઓળખ નંબર અમાન્ય છે.");
  }

  const text = (value, maximum) => {
    if (value != null && typeof value !== "string") {
      throw new Error("રેફરન્સ અથવા નોંધ અમાન્ય છે.");
    }

    const result = (value || "").trim();

    if (result.length > maximum) {
      throw new Error("રેફરન્સ અથવા નોંધ ખૂબ લાંબી છે.");
    }

    return result;
  };

  return {
    key,
    side,
    amountPaise,
    historyComplete,
    kind: amountPaise === 0 ? "verification" : "payment",
    date,
    method,
    reference: text(body.reference, 100),
    note: text(body.note, 300),
    recordedBy: userId,
    recordedAt: now,
  };
}

export function buildReport(pattis) {
  const farmers = new Map();
  const traders = new Map();

  const totals = {
    grossPaise: 0,
    farmerNetPaise: 0,
    traderPaidPaise: 0,
    farmerPaidPaise: 0,
    traderPendingPaise: 0,
    farmerPendingPaise: 0,
    traderUnknown: 0,
    farmerUnknown: 0,
  };

  const deals = pattis.map((patti) => {
    const payments = patti.payments || [];
    const grossPaise = paise(patti.gross);
    const farmerNetPaise = paise(patti.farmerNet);

    const paid = (side) =>
      payments
        .filter((payment) => payment.side === side)
        .reduce((sum, payment) => sum + payment.amountPaise, 0);

    const traderPaidPaise = paid("trader");
    const farmerPaidPaise = paid("farmer");

    const trackedTrader = patti.traderPaymentTracked === true;
    const trackedFarmer = patti.farmerPaymentTracked === true;

    const status = (tracked, received, due) => {
      if (!tracked) return "unknown";
      if (received >= due) return "paid";
      if (received > 0) return "partial";
      return "pending";
    };

    const traderStatus = status(trackedTrader, traderPaidPaise, grossPaise);

    const farmerStatus = status(trackedFarmer, farmerPaidPaise, farmerNetPaise);

    const traderPendingPaise = trackedTrader
      ? Math.max(0, grossPaise - traderPaidPaise)
      : null;

    const farmerPendingPaise = trackedFarmer
      ? Math.max(0, farmerNetPaise - farmerPaidPaise)
      : null;

    const amounts = {
      grossPaise,
      farmerNetPaise,
      traderPaidPaise,
      farmerPaidPaise,
      traderPendingPaise,
      farmerPendingPaise,
    };

    for (const [name, value] of Object.entries(amounts)) {
      totals[name] += value ?? 0;
    }

    totals.traderUnknown += traderStatus === "unknown" ? 1 : 0;
    totals.farmerUnknown += farmerStatus === "unknown" ? 1 : 0;

    const add = (map, person, initial, values) => {
      const groupKey = JSON.stringify([
        String(person?._id || ""),
        patti.cropName,
      ]);

      if (!map.has(groupKey)) {
        map.set(groupKey, {
          person,
          crop: patti.cropName,
          man: 0,
          unknownDeals: 0,
          ...initial,
        });
      }

      const entry = map.get(groupKey);
      entry.man += Number(patti.man || 0);

      for (const [name, value] of Object.entries(values)) {
        entry[name] += value;
      }
    };

    add(
      farmers,
      patti.farmer,
      { netPaise: 0, receivedPaise: 0, pendingPaise: 0 },
      {
        netPaise: farmerNetPaise,
        receivedPaise: farmerPaidPaise,
        pendingPaise: farmerPendingPaise ?? 0,
        unknownDeals: farmerStatus === "unknown" ? 1 : 0,
      },
    );

    add(
      traders,
      patti.trader,
      { grossPaise: 0, paidPaise: 0, pendingPaise: 0 },
      {
        grossPaise,
        paidPaise: traderPaidPaise,
        pendingPaise: traderPendingPaise ?? 0,
        unknownDeals: traderStatus === "unknown" ? 1 : 0,
      },
    );

    return {
      ...patti,
      ...amounts,
      traderStatus,
      farmerStatus,
    };
  });

  return {
    deals,
    totals,
    farmers: [...farmers.values()],
    traders: [...traders.values()],
  };
}

// Duplicate અને વધારે રકમની એન્ટ્રી રોકવા atomic condition.
export function paymentMatch(id, payment) {
  const paid = {
    $sum: {
      $map: {
        input: {
          $filter: {
            input: { $ifNull: ["$payments", []] },
            as: "payment",
            cond: {
              $eq: ["$$payment.side", payment.side],
            },
          },
        },
        as: "payment",
        in: "$$payment.amountPaise",
      },
    },
  };

  const due = {
    $floor: {
      $add: [
        {
          $multiply: [payment.side === "trader" ? "$gross" : "$farmerNet", 100],
        },
        0.5,
      ],
    },
  };

  return {
    _id: id,
    "payments.key": { $ne: payment.key },
    $expr: {
      $lte: [{ $add: [paid, payment.amountPaise] }, due],
    },
  };
}

export function samePayment(existing, next) {
  return [
    "key",
    "side",
    "amountPaise",
    "historyComplete",
    "kind",
    "date",
    "method",
    "reference",
    "note",
  ].every((name) => (existing[name] ?? "") === (next[name] ?? ""));
}
