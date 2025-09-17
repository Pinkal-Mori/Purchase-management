import api from '../../api/axios';

const defaults = [
  { title: "Amazon", link: "https://www.amazon.in/", image:"/image/amazon.png" },
  { title: "Flipkart", link: "https://www.flipkart.com/", image: "/image/flipkart.png" },
  { title: "Robocraze", link: "https://www.robocraze.com/", image: "/image/robocraze.png" },
  { title: "Robu", link: "https://www.robu.in/", image: "/image/robu.png" },
  { title: "Robokits India", link: "https://www.robokits.co.in/", image: "/image/robokits.png" },
  { title: "Think Robotics", link: "https://www.thinkrobotics.com/", image: "/image/thinkrobotics.png" },
  { title: "Probots", link: "https://www.probots.co.in/", image: "/image/probots.png" },
  { title: "Only Screws", link: "https://onlyscrews.in/", image: "/image/onlyscrews.png" },
  { title: "Robotics DNA", link: "https://roboticsdna.in/", image: "/image/roboticsDNA.png" },
  { title: "Kits Guru", link: "https://kitsguru.com/", image: "/image/kitsGuru.png" },
  { title: "RS Delivers", link: "https://in.rsdelivers.com/", image: "/image/rsdelivers.png" },
  { title: "Fly Robo", link: "https://www.flyrobo.in/", image: "/image/flyrobo.png" },
  { title: "Sunrom", link: "https://www.sunrom.com/", image: "/image/sunrom.png" },
  { title: "Zbotic", link: "https://zbotic.in/", image: "/image/zbotic.png" },
  { title: "Digikey", link: "https://www.digikey.in/", image: "/image/digikey.png" }
];




export default function WebBucketList({ items, onEdit, onDelete }) {
  const websites = [...defaults, ...items];

  return (
    <div className="image-gallery-container">
      {websites.map((w, idx) => (
        <div className={"gallery" + (idx >= defaults.length ? " custom-bucket": "")} key={idx}>
          <a href={w.link} target="_blank" title={w.title} rel="noreferrer">
            <img
              src={w.image}
              alt={w.title}
              onError={(e)=> e.currentTarget.src='https://placehold.co/150x150/f0f2f5/555?text=No+Image'}
            />
          </a>
          <div className="desc">{w.title}</div>
          {idx >= defaults.length && (
            <div className="gallery-actions">
              <button className="action-btn edit-btn" onClick={()=>onEdit(items[idx - defaults.length])}>✏️</button>
              <button className="action-btn delete-btn" onClick={()=>onDelete(items[idx - defaults.length])}>🗑️</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
