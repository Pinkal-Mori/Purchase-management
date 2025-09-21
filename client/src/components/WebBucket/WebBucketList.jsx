import { useState, useEffect } from "react";
import api from "../../api/axios";

const defaults = [
  {
    _id: "1",
    title: "Amazon",
    link: "https://www.amazon.in/",
    image: "/image/amazon.png",
  },
  {
    _id: "2",
    title: "Flipkart",
    link: "https://www.flipkart.com/",
    image: "/image/flipkart.png",
  },
  {
    _id: "3",
    title: "Robocraze",
    link: "https://www.robocraze.com/",
    image: "/image/robocraze.png",
  },
  {
    _id: "4",
    title: "Robu",
    link: "https://www.robu.in/",
    image: "/image/robu.png",
  },
  {
    _id: "5",
    title: "Robokits India",
    link: "https://www.robokits.co.in/",
    image: "/image/robokits.png",
  },
  {
    _id: "6",
    title: "Think Robotics",
    link: "https://www.thinkrobotics.com/",
    image: "/image/thinkrobotics.png",
  },
  {
    _id: "7",
    title: "Probots",
    link: "https://www.probots.co.in/",
    image: "/image/probots.png",
  },
  {
    _id: "8",
    title: "Only Screws",
    link: "https://onlyscrews.in/",
    image: "/image/onlyscrews.png",
  },
  {
    _id: "9",
    title: "Robotics DNA",
    link: "https://roboticsdna.in/",
    image: "/image/roboticsDNA.png",
  },
  {
    _id: "10",
    title: "Kits Guru",
    link: "https://kitsguru.com/",
    image: "/image/kitsGuru.png",
  },
  {
    _id: "11",
    title: "RS Delivers",
    link: "https://in.rsdelivers.com/",
    image: "/image/rsdelivers.png",
  },
  {
    _id: "12",
    title: "Fly Robo",
    link: "https://www.flyrobo.in/",
    image: "/image/flyrobo.png",
  },
  {
    _id: "13",
    title: "Sunrom",
    link: "https://www.sunrom.com/",
    image: "/image/sunrom.png",
  },
  {
    _id: "14",
    title: "Zbotic",
    link: "https://zbotic.in/",
    image: "/image/zbotic.png",
  },
  {
    _id: "15",
    title: "Digikey",
    link: "https://www.digikey.in/",
    image: "/image/digikey.png",
  },
];

export default function WebBucketList({ onEdit, refreshTrigger }) {
  const [customWebsites, setCustomWebsites] = useState([]);
  const allWebsites = [...defaults, ...customWebsites];

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await api.get("/buckets");
        setCustomWebsites(response.data);
      } catch (err) {
        console.error("Failed to fetch websites:", err);
      }
    };
    fetchWebsites();
  }, [refreshTrigger]);

  const handleDelete = async (websiteToDelete) => {
    try {
      await api.delete(`/buckets/${websiteToDelete._id}`); // Update the local state directly to show the change immediately
      setCustomWebsites((prevWebsites) =>
        prevWebsites.filter((w) => w._id !== websiteToDelete._id)
      ); // If the parent component needs to know about the change, you would use a callback. // For now, we are relying on local state update and the refreshTrigger from the modal's close event.
    } catch (err) {
      console.error("Failed to delete website:", err);
    }
  };

  return (
    <div className="image-gallery-container">
           {" "}
      {allWebsites.map((w, idx) => (
        <div
          className={
            "gallery" + (idx >= defaults.length ? " custom-bucket" : "")
          }
          key={w._id}
        >
                   {" "}
          <a href={w.link} target="_blank" title={w.title} rel="noreferrer">
                       {" "}
            <img
              src={w.image}
              alt={w.title}
              onError={(e) =>
                (e.currentTarget.src =
                  "https://placehold.co/150x150/f0f2f5/555?text=No+Image")
              }
            />
                     {" "}
          </a>
                    <div className="desc">{w.title}</div>         {" "}
          {idx >= defaults.length && (
            <div className="gallery-actions">
                           {" "}
              <button className="action-btn edit-btn" onClick={() => onEdit(w)}>
                ✏️
              </button>
                           {" "}
              <button
                className="action-btn delete-btn"
                onClick={() => handleDelete(w)}
              >
                🗑️
              </button>
                         {" "}
            </div>
          )}
                 {" "}
        </div>
      ))}
         {" "}
    </div>
  );
}
