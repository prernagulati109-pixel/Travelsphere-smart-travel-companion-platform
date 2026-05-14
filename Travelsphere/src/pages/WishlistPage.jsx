import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Trash2, MapPin, Hotel, ChevronRight, ExternalLink } from 'lucide-react';
import '../styles/index.css';

function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <div className="app-shell">
      <Navbar activePage="wishlist" />

      <main className="wishlist-page">
        <header className="wishlist-header">
          <div className="header-info">
            <h1>My Likelist</h1>
            <p>Your curated collection of dream destinations and luxury stays.</p>
          </div>
          <div className="wishlist-stats">
            <div className="stat-card">
              <span className="stat-value">{wishlist.length}</span>
              <span className="stat-label">Saved Items</span>
            </div>
          </div>
        </header>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist animate-fade-in">
            <div className="empty-icon-wrap">
              <Heart size={64} className="heart-pulse" />
            </div>
            <h2>Your Likelist is Empty</h2>
            <p>Start exploring and heart your favorite places and hotels to see them here.</p>
            <div className="empty-actions">
              <Link to="/explore" className="primary-btn">Explore Destinations</Link>
              <Link to="/hotels" className="secondary-btn">Find Hotels</Link>
            </div>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={`${item.type}-${item.id}`} className="wishlist-card animate-slide-up">
                <div className="card-image-wrap">
                  <img src={item.image || item.img} alt={item.name} />
                  <div className="item-type-tag">
                    {item.type === 'hotel' ? <Hotel size={14} /> : <MapPin size={14} />}
                    {item.type === 'hotel' ? 'Hotel' : 'Destination'}
                  </div>
                  <button 
                    className="remove-wishlist-btn"
                    onClick={() => toggleWishlist(item)}
                    title="Remove from Likelist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="card-content">
                  <div className="card-info">
                    <h3>{item.name}</h3>
                    <div className="card-meta">
                      <span className="location">
                        <MapPin size={14} />
                        {item.location || item.destination}
                      </span>
                      {item.price && (
                        <span className="price">
                          Starting at <strong>₹{item.price}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-actions">
                    <Link 
                      to={item.type === 'hotel' ? `/hotels/${item.id}` : `/place/${item.name.toLowerCase().replace(/\s+/g, "-")}`} 
                      className="view-item-btn"
                    >
                      View Details
                      <ChevronRight size={18} />
                    </Link>
                    <button className="share-mini-btn" onClick={() => {
                        const slug = item.type === 'hotel' ? item.id : item.name.toLowerCase().replace(/\s+/g, "-");
                        const url = window.location.origin + (item.type === 'hotel' ? `/hotels/${item.id}` : `/place/${slug}`);
                        if (navigator.share) {
                          navigator.share({
                            title: `Check out ${item.name} on TravelSphere`,
                            url: url
                          });
                        } else {
                          navigator.clipboard.writeText(url);
                          alert('Link copied to clipboard!');
                        }
                    }}>
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      <style>{`
        .wishlist-page {
          padding: 40px 0;
        }
        .wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 30px;
        }
        .wishlist-header h1 {
          font-size: 2.5rem;
          color: #1e293b;
          margin: 0 0 10px 0;
        }
        .wishlist-header p {
          color: #64748b;
          font-size: 1.1rem;
          margin: 0;
        }
        .stat-card {
          background: white;
          padding: 15px 30px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #f1f5f9;
        }
        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #2563eb;
        }
        .stat-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 600;
        }

        .empty-wishlist {
          text-align: center;
          padding: 100px 20px;
          background: white;
          border-radius: 32px;
          border: 1px dashed #cbd5e1;
        }
        .empty-icon-wrap {
          margin-bottom: 24px;
          color: #94a3b8;
        }
        .heart-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); color: #ef4444; }
          100% { transform: scale(1); }
        }
        .empty-wishlist h2 {
          font-size: 1.8rem;
          margin-bottom: 12px;
        }
        .empty-wishlist p {
          color: #64748b;
          margin-bottom: 32px;
        }
        .empty-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
        }
        .wishlist-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(15, 43, 86, 0.08);
          border: 1px solid #f1f5f9;
          transition: transform 0.3s ease;
        }
        .wishlist-card:hover {
          transform: translateY(-8px);
        }
        .card-image-wrap {
          position: relative;
          height: 220px;
        }
        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-type-tag {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #1e293b;
        }
        .remove-wishlist-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          display: grid;
          place-items: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .remove-wishlist-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .card-content {
          padding: 24px;
        }
        .card-info h3 {
          margin: 0 0 12px 0;
          font-size: 1.4rem;
          color: #1e293b;
        }
        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .location {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 0.9rem;
        }
        .price {
          font-size: 0.9rem;
          color: #64748b;
        }
        .price strong {
          color: #1e293b;
          font-size: 1.1rem;
        }

        .card-actions {
          display: flex;
          gap: 12px;
        }
        .view-item-btn {
          flex: 1;
          background: #2563eb;
          color: white;
          text-decoration: none;
          padding: 12px;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
        }
        .view-item-btn:hover {
          background: #1d4ed8;
        }
        .share-mini-btn {
          width: 48px;
          background: #f1f5f9;
          border: none;
          border-radius: 12px;
          color: #64748b;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.2s;
        }
        .share-mini-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        .primary-btn {
          background: #2563eb;
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
        }
        .secondary-btn {
          background: #f1f5f9;
          color: #1e293b;
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .wishlist-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .wishlist-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default WishlistPage;

