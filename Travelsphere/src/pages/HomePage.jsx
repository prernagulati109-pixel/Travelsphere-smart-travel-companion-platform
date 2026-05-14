import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiService } from '../services/apiService';
import { destinations as staticDestinations, mapApiToDestination } from '../data/data';

const features = [
  { title: 'Explore Places', icon: '📍' },
  { title: 'Find Hotels', icon: '🏨' },
  { title: 'Travel Options', icon: '✈️' },
  { title: 'Plan Itinerary', icon: '📝' }
];

const destinations = [
  {
    name: 'Paris',
    image:
      'https://formatted-decks.s3.amazonaws.com/image/bf72ba4c-b3ec-49ee-94c0-b65665ba27ea.jpg'
  },
  {
    name: 'Kyoto',
    image:
      'https://www.tripsavvy.com/thmb/e5wZDX6HW-JmfA8Yu0KEbCZ3zLo=/2121x1414/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-530105220-5c337bae46e0fb00012fcdfb.jpg'
  },
  {
    name: 'Maldives',
    image:
      'https://d36tnp772eyphs.cloudfront.net/blogs/1/2011/05/maldives-1200x853.jpg'
  },
  {
    name: 'New York',
    image:
      'https://cdn.pixabay.com/photo/2022/11/07/20/23/new-york-7577186_1280.jpg'
  },
  {
    name: 'Tokyo',
    image:
      'https://wallpaperaccess.com/full/19076.jpg'
  },
  {
    name: 'Bali',
    image:
      'https://tse4.mm.bing.net/th/id/OIP.OINRF_r_JyOH80rC0WzxCAHaEK?pid=Api&P=0&h=180'
  }
];

const reasons = [
  { title: 'Smart Itinerary', icon: '🗓️' },
  { title: 'Real-time Maps', icon: '📍' },
  { title: 'Best Hotel Deals', icon: '⭐' },
  { title: 'User Reviews', icon: '💬' },
  { title: 'Budget Tracking', icon: '💰' }
];

const heroImages = [
        'https://formatted-decks.s3.amazonaws.com/image/bf72ba4c-b3ec-49ee-94c0-b65665ba27ea.jpg',
        'https://www.tripsavvy.com/thmb/e5wZDX6HW-JmfA8Yu0KEbCZ3zLo=/2121x1414/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-530105220-5c337bae46e0fb00012fcdfb.jpg',
        'https://d36tnp772eyphs.cloudfront.net/blogs/1/2011/05/maldives-1200x853.jpg',
        'https://cdn.pixabay.com/photo/2022/11/07/20/23/new-york-7577186_1280.jpg',
        'https://wallpaperaccess.com/full/19076.jpg',
        'https://tse4.mm.bing.net/th/id/OIP.OINRF_r_JyOH80rC0WzxCAHaEK?pid=Api&P=0&h=180'


];

function HomePage() {
  const [search, setSearch] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  const [activeDot, setActiveDot] = useState(0);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      if (maxScrollLeft > 0) {
        // Assume 5 dots max
        const scrollProgress = scrollLeft / maxScrollLeft;
        const currentDot = Math.min(Math.round(scrollProgress * 5), 5);
        setActiveDot(currentDot);
      }
    }
  };
  const [realDestinations, setRealDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      // Fetch some popular cities as a default "real-time" experience
      const results = await apiService.searchLocations('London');
      if (results && results.length > 0) {
        const mapped = results.slice(0, 6).map(mapApiToDestination);
        setRealDestinations(mapped);
      }
      setLoading(false);
    };
    fetchPopular();
  }, []);

  const destinations = realDestinations.length > 0 ? realDestinations : staticDestinations;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const filteredDestinations = useMemo(() => {
    if (!search.trim()) return destinations;
    return destinations.filter(d => 
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleFeatureClick = (title) => {
    const routes = {
      'Explore Places': '/explore',
      'Find Hotels': '/hotels',
      'Travel Options': '/travel',
      'Plan Itinerary': '/itinerary',
      'User Reviews': '#testimonials',
      
      // Reasons
      'Smart Itinerary': '/itinerary',
      'Real-time Maps': '/explore',
      'Best Hotel Deals': '/hotels',
      'Budget Tracking': '/explore'
    };
    if (routes[title]) {
      if (routes[title].startsWith('#')) {
        document.querySelector(routes[title])?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(routes[title]);
      }
    }
  };

  return (
    <div className="app-shell">
      <Navbar activePage="home" />

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            {isLoggedIn && (
              <div className="hero-welcome slide-up">
                <span className="welcome-icon">👋</span>
                <span className="welcome-text">Welcome back, <strong>{user?.name}</strong></span>
              </div>
            )}
            <span className="eyebrow">Plan Your Dream Trip</span>
            <h2>All your travel needs in one place.</h2>
            <p>Discover destinations, book hotels, and manage your itinerary with TravelSphere.</p>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search for destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={() => {
                navigate(`/explore?search=${encodeURIComponent(search)}`);
              }}>Explore</button>
            </div>
          </div>
          <div className="hero-slider">
            {heroImages.map((img, idx) => (
              <div 
                key={img} 
                className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
          </div>
        </section>

        <section className="section features" id="explore">
          <h3>Quick Features</h3>
          <div className="feature-grid">
            {features.map((feature) => (
              <button key={feature.title} className="feature-card" onClick={() => handleFeatureClick(feature.title)}>
                <div className="feature-icon">{feature.icon}</div>
                <p>{feature.title}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="section destinations" id="hotels">
          <div className="section-heading centered">
            <h3>Top Destinations {loading && <span className="loader-inline">...</span>}</h3>
            <p>Explore the most beautiful places around the world</p>
          </div>
          <div className="carousel-container-box">
            <button className="carousel-btn prev" onClick={scrollPrev}>‹</button>
            <div className="dest-carousel-wrapper">
              <div className="dest-carousel" ref={carouselRef} onScroll={handleScroll}>
                {filteredDestinations.map((destination) => {
                  const slug = destination.name.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <Link key={destination.name} to={`/place/${slug}`} className="dest-card-link">
                      <div className="dest-card">
                        <img src={destination.image} alt={destination.name} />
                        <div className="dest-label">{destination.name}</div>
                      </div>
                    </Link>
                  );
                })}
                {filteredDestinations.length === 0 && (
                  <div className="no-results">
                    <p>No destinations found matching "{search}"</p>
                  </div>
                )}
              </div>
            </div>
            <button className="carousel-btn next" onClick={scrollNext}>›</button>
            <div className="carousel-dots">
              {[0, 1, 2, 3, 4, 5].map(idx => (
                <span 
                  key={idx} 
                  className={`dot ${activeDot === idx ? 'active' : ''}`}
                ></span>
              ))}
            </div>
          </div>
        </section>
      

        <section className="section reasons" id="itinerary">
          <h3>Why Choose TravelSphere?</h3>
          <div className="reasons-grid">
            {reasons.map((reason) => (
              <button 
                key={reason.title} 
                className="reason-card"
                onClick={() => handleFeatureClick(reason.title)}
              >
                <div className="reason-icon">{reason.icon}</div>
                <p>{reason.title}</p>
              </button>
            ))}
          </div>
        </section>
      </main>

      <section id="testimonials" className="section testimonials">
        <h3>What Our Travelers Say</h3>
        <div className="testimonials-grid">
          {[
            { name: 'James Wilson', city: 'London', text: 'TravelSphere made my trip to Bali seamless and unforgettable. Highly recommend!', img: 'https://i.pravatar.cc/150?u=james' },
            { name: 'Sarah Chen', city: 'Singapore', text: 'The hotel recommendations were spot on. Best travel app I have used.', img: 'https://i.pravatar.cc/150?u=sarah' },
            { name: 'Marco Rossi', city: 'Rome', text: 'Fantastic itinerary planning. Saved me hours of research.', img: 'https://i.pravatar.cc/150?u=marco' }
          ].map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-header">
                <img src={t.img} alt={t.name} />
                <div>
                  <h4>{t.name}</h4>
                  <p>{t.city}</p>
                </div>
              </div>
              <p>"{t.text}"</p>
              <div className="rating">⭐⭐⭐⭐⭐</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;

