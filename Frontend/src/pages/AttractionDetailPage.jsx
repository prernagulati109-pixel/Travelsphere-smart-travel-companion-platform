import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fullPlaceData } from '../data/data';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  MapPin, Clock, Star, 
  Calendar, CheckCircle, Info,
  ArrowLeft, Share2, Heart,
  ShieldCheck, Zap, Users
} from 'lucide-react';
import '../styles/index.css';

function AttractionDetailPage() {
  const { placeName, attractionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const normalizeSlug = (value) =>
    value
      ? value.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : '';

  const placeKey =
    Object.keys(fullPlaceData).find((key) => normalizeSlug(key) === placeName) ||
    Object.keys(fullPlaceData).find((key) => normalizeSlug(fullPlaceData[key].name) === placeName);

  const place = fullPlaceData[placeKey] || fullPlaceData['Paris'];
  const attraction =
    place.attractions.find((a) => normalizeSlug(a.name) === attractionId) ||
    place.attractions[0];

  return (
    <div className="attraction-detail-modern">
      <Navbar />
      
      <div className="ad-container">
        {/* Header Navigation */}
        <div className="ad-top-nav">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
          <div className="ad-actions">
            <button className="action-btn" onClick={() => setIsWishlisted(!isWishlisted)}>
              <Heart size={18} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "currentColor"} />
            </button>
            <button className="action-btn"><Share2 size={18} /></button>
          </div>
        </div>

        <div className="ad-content-layout">
          {/* Main Info */}
          <main className="ad-main">
            <div className="ad-hero-img">
              <img src={attraction.images[0]} alt={attraction.name} />
              <div className="ad-category-badge">Experience</div>
            </div>

            <div className="ad-header">
              <div className="ad-title-area">
                <h1>{attraction.name}</h1>
                <div className="ad-loc-row">
                  <MapPin size={16} /> <span>{place.name}, {place.country || 'Europe'}</span>
                </div>
              </div>
              <div className="ad-rating">
                <Star size={18} fill="#fbbf24" color="#fbbf24" />
                <span>4.8 (1,200 Reviews)</span>
              </div>
            </div>

            <div className="ad-description">
              <h3>About this Experience</h3>
              <p>{attraction.description}</p>
              <p>Discover the secrets of {attraction.name} with our expert-led tour. Learn about the rich history and cultural significance of this landmark while enjoying skip-the-line access.</p>
            </div>

            <div className="ad-highlights">
              <h3>Experience Highlights</h3>
              <div className="highlights-grid">
                <div className="h-item"><CheckCircle size={18} /> Skip-the-line access</div>
                <div className="h-item"><CheckCircle size={18} /> Certified local guide</div>
                <div className="h-item"><CheckCircle size={18} /> High-quality photo spots</div>
                <div className="h-item"><CheckCircle size={18} /> Small group experience</div>
              </div>
            </div>
          </main>

          {/* Sidebar Booking */}
          <aside className="ad-sidebar">
            <div className="ad-booking-card">
              <div className="ad-price-row">
                <span className="price-tag">₹2,500</span>
                <span className="price-unit">per person</span>
              </div>

              <div className="ad-info-rows">
                <div className="ad-info-item">
                  <Clock size={18} />
                  <div>
                    <p>Duration</p>
                    <span>2 - 3 Hours</span>
                  </div>
                </div>
                <div className="ad-info-item">
                  <Users size={18} />
                  <div>
                    <p>Group Size</p>
                    <span>Max 12 People</span>
                  </div>
                </div>
                <div className="ad-info-item">
                  <Calendar size={18} />
                  <div>
                    <p>Availability</p>
                    <span>Every Day</span>
                  </div>
                </div>
              </div>

              <button className="ad-reserve-btn" onClick={() => alert('Booking functionality integrated! Check your email for details.')}>
                Reserve Your Spot
              </button>

              <div className="ad-guarantee">
                <ShieldCheck size={14} /> <span>Best Price Guarantee</span>
              </div>
            </div>

            <div className="ad-tip-card">
              <Zap size={20} className="tip-icon" />
              <div>
                <h4>Insider Tip</h4>
                <p>Visit during sunset for the most breathtaking views and photography lighting.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />

      <style>{`
        .attraction-detail-modern {
          background: #fdfdfd;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }
        .ad-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }
        .ad-top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          font-weight: 700;
          color: #2563eb;
          cursor: pointer;
        }
        .ad-actions { display: flex; gap: 12px; }
        .action-btn {
          background: white;
          border: 1px solid #e2e8f0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }
        .action-btn:hover { background: #f8fafc; transform: scale(1.05); }

        .ad-content-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 48px;
        }
        .ad-hero-img {
          height: 450px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          margin-bottom: 32px;
        }
        .ad-hero-img img { width: 100%; height: 100%; object-fit: cover; }
        .ad-category-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(0,0,0,0.6);
          color: white;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          backdrop-filter: blur(4px);
        }

        .ad-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        .ad-header h1 { font-size: 2.8rem; line-height: 1.1; margin-bottom: 12px; }
        .ad-loc-row { display: flex; align-items: center; gap: 8px; color: #64748b; font-weight: 500; }
        .ad-rating { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #334155; }

        .ad-description h3, .ad-highlights h3 { font-size: 1.4rem; margin-bottom: 16px; }
        .ad-description p { line-height: 1.8; color: #475569; margin-bottom: 24px; font-size: 1.05rem; }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }
        .h-item { display: flex; align-items: center; gap: 12px; font-weight: 600; color: #10b981; font-size: 0.95rem; }

        .ad-booking-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.06);
          position: sticky;
          top: 100px;
        }
        .ad-price-row { margin-bottom: 32px; }
        .price-tag { display: block; font-size: 2.2rem; font-weight: 800; color: #0f172a; }
        .price-unit { font-size: 0.9rem; color: #64748b; }

        .ad-info-rows { display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; }
        .ad-info-item { display: flex; gap: 16px; align-items: center; }
        .ad-info-item p { font-size: 0.75rem; color: #64748b; margin: 0; }
        .ad-info-item span { font-weight: 700; color: #1e293b; }

        .ad-reserve-btn {
          width: 100%;
          background: #2563eb;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: 0.2s;
          margin-bottom: 16px;
        }
        .ad-reserve-btn:hover { background: #1d4ed8; transform: translateY(-2px); }
        .ad-guarantee { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.8rem; color: #94a3b8; font-weight: 600; }

        .ad-tip-card {
          margin-top: 24px;
          background: #eff6ff;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          gap: 16px;
        }
        .tip-icon { color: #2563eb; }
        .ad-tip-card h4 { margin-bottom: 6px; color: #1e293b; }
        .ad-tip-card p { font-size: 0.9rem; color: #475569; line-height: 1.5; margin: 0; }

        @media (max-width: 1100px) {
          .ad-content-layout { grid-template-columns: 1fr; }
          .ad-hero-img { height: 350px; }
          .ad-sidebar { order: -1; }
          .ad-booking-card { position: static; margin-bottom: 32px; }
        }
      `}</style>
    </div>
  );
}

export default AttractionDetailPage;
