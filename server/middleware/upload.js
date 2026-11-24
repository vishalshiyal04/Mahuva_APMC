import multer from "multer";
import fs from "fs";
import crypto from "crypto";

fs.mkdirSync("uploads", { recursive: true });

// ફાઇલનું નામ/એક્સટેન્શન યુઝરના નામ પરથી નહીં, ફાઇલના પ્રકાર (mimetype) પરથી નક્કી થાય.
// એટલે "evil.html" ને image/png કહીને મોકલે તો પણ .png તરીકે જ સેવ થાય, સ્ક્રિપ્ટ ચાલી ન શકે.
const EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads",
    filename: (r, f, cb) =>
      cb(
        null,
        Date.now() +
          "-" +
          crypto.randomBytes(8).toString("hex") +
          EXT[f.mimetype],
      ),
  }),
  limits: { fileSize: 5e6, files: 1 },
  fileFilter: (r, f, cb) => cb(null, Object.hasOwn(EXT, f.mimetype)),
});

export default upload;
