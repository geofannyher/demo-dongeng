import VideocamIcon from "@mui/icons-material/Videocam";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import CakeIcon from "@mui/icons-material/Cake";
import Face6Icon from "@mui/icons-material/Face6";
export const cardData = [
  {
    id: 1,
    title: "Dia Angkasa Maxtream Original",
    category: "Film",
    credits: 2,
    icons: VideocamIcon,
    image:
      "https://imgx.sonora.id/crop/0x0:0x0/x/photo/2024/07/29/dia-angkasajpg-20240729020043.jpg",
  },
  {
    id: 2,
    title: "Resep Gulai Ikan Patin",
    category: "Resep Makanan",
    credits: 2,
    icons: CakeIcon,
    image:
      "https://www.masakapahariini.com/wp-content/uploads/2020/04/Gulai-Ikan-Patin-500x300.jpg",
  },
  {
    id: 3,
    title: "Mayat Jadi Potong - Scary Things",
    category: "Horor",
    credits: 2,
    icons: Face6Icon,
    image: "https://images.noiceid.cc/catalog/compressed/content-1690891718613",
  },
  {
    id: 4,
    title: "Legenda Candi Prambanan",
    category: "Cerita Anak",
    credits: 2,
    icons: ImportContactsIcon,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoP_6MVxXxkju1TiOMpMPJaHMaVDQ5tyPOEQ&s",
  },
];

const model = "gpt-4o";
const starName = "naya_dongeng";
const keyword = "##creepy##";
const videoTalk =
  // "https://res.cloudinary.com/dcd1jeldi/video/upload/v1731581284/m3qr5uj61gfg5jqskgxw.mp4";
  "https://res.cloudinary.com/dcd1jeldi/video/upload/v1731650255/daxeyujlktezqvnyf6kl.mp4";
const videoIdle =
  // "https://res.cloudinary.com/dcd1jeldi/video/upload/v1731389998/dongeng-idle.mp4";
  "https://res.cloudinary.com/dcd1jeldi/video/upload/v1731650078/hxx5fozmmmbqntbdivpq.mp4";

export { model, starName, keyword, videoIdle, videoTalk };
