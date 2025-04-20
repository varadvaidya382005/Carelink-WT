import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building2, Shield, ArrowRight, CheckCircle, 
  Globe, HandHeart, Sparkles, Menu, X, ChevronRight,
  MoonStar, Sun, Star, Bell, Calendar, BarChart3, Search
} from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const videoRef = useRef(null);

  // Handle scroll events for navbar transformation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial animations and testimonial rotation
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Play video when it loads
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video autoplay prevented:", e));
    }
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Member",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote: "CareLink helped me connect with local NGOs to address food insecurity in my neighborhood."
    },
    {
      name: "David Chen",
      role: "NGO Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote: "This platform has revolutionized how we identify and respond to community needs."
    },
    {
      name: "Maria Garcia",
      role: "Volunteer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote: "I've seen firsthand how CareLink brings communities together to solve real problems."
    }
  ];

  const stats = [
    { number: "500+", label: "Communities Served", icon: Globe },
    { number: "1000+", label: "Issues Resolved", icon: CheckCircle },
    { number: "50+", label: "NGO Partners", icon: HandHeart },
    { number: "10K+", label: "Active Users", icon: Users }
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track community needs and impact with our interactive dashboards and visualizations.",
      color: "bg-gradient-to-r from-purple-400 to-purple-600"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Stay updated with alerts about relevant issues in your area or organization.",
      color: "bg-gradient-to-r from-amber-400 to-amber-600"
    },
    {
      icon: Calendar,
      title: "Event Coordination",
      description: "Plan and organize community outreach events with our integrated calendar system.",
      color: "bg-gradient-to-r from-emerald-400 to-emerald-600"
    }
  ];

  const userRoles = [
    {
      icon: Users,
      title: "For Communities",
      description: "Easily report and track local issues, connect with NGOs, and see real impact in your area.",
      color: "bg-gradient-to-r from-blue-400 to-blue-600"
    },
    {
      icon: Building2,
      title: "For NGOs",
      description: "Streamline operations, verify issues efficiently, and coordinate responses effectively.",
      color: "bg-gradient-to-r from-teal-400 to-teal-600"
    },
    {
      icon: Shield,
      title: "For Admins",
      description: "Comprehensive oversight tools to ensure quality and maintain platform integrity.",
      color: "bg-gradient-to-r from-violet-400 to-violet-600"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-teal-50 via-white to-purple-50'} overflow-hidden font-sans transition-colors duration-300`}>
      {/* Fixed Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? (darkMode ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-md shadow-lg') : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className={`mr-1 p-2 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-teal-600'}`}>
                <Star className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">
                CareLink
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/features" className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-teal-600'} transition-colors`}>Features</Link>
              <Link to="/communities" className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-teal-600'} transition-colors`}>Communities</Link>
              <Link to="/resources" className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-teal-600'} transition-colors`}>Resources</Link>
              <Link to="/about" className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-teal-600'} transition-colors`}>About</Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={20} /> : <MoonStar size={20} />}
              </button>
              
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-teal-600'} transition-colors`}>Log in</Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-full ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-teal-600 hover:bg-teal-700'} text-white font-medium transition-colors`}
                >
                  Sign up
                </Link>
              </div>
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/features" className={`block px-3 py-2 rounded-md font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>Features</Link>
            <Link to="/communities" className={`block px-3 py-2 rounded-md font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>Communities</Link>
            <Link to="/resources" className={`block px-3 py-2 rounded-md font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>Resources</Link>
            <Link to="/about" className={`block px-3 py-2 rounded-md font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>About</Link>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <Link to="/login" className={`block px-3 py-2 rounded-md font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>Log in</Link>
              <Link to="/register" className={`block px-3 py-2 rounded-md font-medium mt-2 ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-teal-600 hover:bg-teal-700'} text-white transition-colors`}>Sign up</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Video Background and Search Feature */}
      <div className={`relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden ${darkMode ? 'bg-gray-900' : ''}`}>
        {/* Background Video (for desktop only) */}
        <div className="absolute inset-0 hidden md:block opacity-20">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/api/placeholder/800/600" type="video/mp4" />
          </video>
        </div>
        
        {/* Hero Content */}
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              <span className={`bg-gradient-to-r ${darkMode ? 'from-teal-400 to-purple-400' : 'from-teal-600 to-purple-600'} bg-clip-text text-transparent`}>
                Connecting Communities with Purpose
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-12 ${darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto leading-relaxed`}>
              Empowering communities and NGOs to create meaningful change together. Join us in making a difference, one connection at a time.
            </p>
            
            {/* Search Bar */}
            <div className={`flex flex-col md:flex-row items-center justify-center max-w-2xl mx-auto p-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-full shadow-xl mb-12`}>
              <div className="flex items-center flex-grow w-full p-2">
                <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                <input 
                  type="text" 
                  placeholder="Search for communities or projects..." 
                  className={`w-full border-none focus:ring-0 focus:outline-none ${darkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'}`}
                />
              </div>
              <button className={`whitespace-nowrap px-6 py-3 rounded-full ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-teal-600 hover:bg-teal-700'} text-white font-medium transition-all transform hover:scale-105 mt-4 md:mt-0 w-full md:w-auto`}>
                Find Opportunities
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
              <Link
                to="/register"
                className={`group px-8 py-4 rounded-full ${darkMode ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600' : 'bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600'} text-white font-medium transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center`}
              >
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/learn-more"
                className={`px-8 py-4 rounded-full ${darkMode ? 'border-2 border-gray-700 text-gray-300 hover:border-purple-500 hover:text-purple-400' : 'border-2 border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600'} font-medium transition-all transform hover:scale-105 flex items-center justify-center`}
              >
                Learn More
                <ChevronRight className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Icons Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 left-1/4 animate-float-slow">
            <Globe className={`h-16 w-16 ${darkMode ? 'text-purple-500/20' : 'text-teal-500/20'}`} />
          </div>
          <div className="absolute top-1/4 right-10 animate-float">
            <Users className={`h-24 w-24 ${darkMode ? 'text-indigo-500/20' : 'text-purple-500/20'}`} />
          </div>
          <div className="absolute bottom-10 left-20 animate-float-medium">
            <HandHeart className={`h-20 w-20 ${darkMode ? 'text-teal-500/20' : 'text-teal-500/20'}`} />
          </div>
        </div>
      </div>

      {/* Stats Section with Animation */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform hover:scale-105 transition-transform ${darkMode ? 'hover:bg-gray-700' : 'hover:shadow-lg'} rounded-xl p-6 cursor-pointer`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={`inline-flex items-center justify-center p-5 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-teal-100 to-purple-100'} rounded-full mb-6 ${darkMode ? '' : 'shadow-md'}`}>
                  <stat.icon className={`h-8 w-8 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                </div>
                <div className={`text-5xl font-bold ${darkMode ? 'text-white' : 'bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent'} mb-3`}>
                  {stat.number}
                </div>
                <div className={darkMode ? 'text-gray-300 font-medium' : 'text-gray-700 font-medium'}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-white to-teal-50'} py-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${darkMode ? 'bg-gray-800 text-teal-400' : 'bg-teal-100 text-teal-800'} mb-4`}>
              NEW FEATURES
            </span>
            <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Discover What's New</h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Our platform is constantly evolving with new tools to help you make a bigger impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 transform hover:-translate-y-2 transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-750 hover:shadow-lg shadow-lg shadow-purple-900/5' : 'bg-white hover:shadow-2xl shadow-xl'} group`}
              >
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{feature.title}</h3>
                <p className={darkMode ? 'text-gray-400 leading-relaxed' : 'text-gray-600 leading-relaxed'}>{feature.description}</p>
                <a href="#" className={`inline-flex items-center mt-4 font-medium ${darkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'}`}>
                  Learn more <ChevronRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Why Choose CareLink?</h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discover how we're transforming community support</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {userRoles.map((role, index) => (
              <div
                key={index}
                className={`rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white'} p-8 transform hover:-translate-y-2 transition-all duration-300 ${darkMode ? 'hover:bg-gray-650' : 'hover:shadow-2xl'} ${darkMode ? 'shadow-lg shadow-purple-900/5' : 'shadow-xl'} group`}
              >
                <div className={`${role.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <role.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{role.title}</h3>
                <p className={darkMode ? 'text-gray-300 leading-relaxed' : 'text-gray-600 leading-relaxed'}>{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials with 3D Card Effect */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-teal-50 to-purple-50'} py-28`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center justify-center p-4 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-teal-100 to-purple-100'} rounded-full mb-6`}>
              <Sparkles className={`h-12 w-12 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
            </div>
            <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Success Stories</h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Hear from our community members</p>
          </div>
          <div className="relative h-[450px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 transform perspective-1000 ${
                  index === activeTestimonial
                    ? 'opacity-100 rotate-y-0'
                    : index < activeTestimonial
                    ? 'opacity-0 -rotate-y-90'
                    : 'opacity-0 rotate-y-90'
                }`}
              >
                <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-2xl ${darkMode ? 'shadow-lg shadow-purple-900/10' : 'shadow-xl'} p-12 max-w-2xl mx-auto hover:shadow-2xl transition-shadow`}>
                  <div className="relative mb-8">
                    <div className={`absolute -top-2 -left-2 w-24 h-24 ${darkMode ? 'bg-gradient-to-br from-teal-500/30 to-purple-500/30' : 'bg-gradient-to-br from-teal-300 to-purple-300'} rounded-full opacity-30 blur-md`}></div>
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-lg relative z-10"
                    />
                  </div>
                  <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} italic mb-8`}>"{testimonial.quote}"</p>
                  <div className="text-center">
                    <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</h4>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-3 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeTestimonial 
                    ? (darkMode ? 'bg-teal-400 w-8' : 'bg-teal-500 w-8') 
                    : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-teal-300')
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with Parallax Effect */}
      <div className={`relative ${darkMode ? 'bg-gradient-to-r from-purple-900 to-indigo-900' : 'bg-gradient-to-r from-teal-600 to-purple-600'} py-28 overflow-hidden`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 top-20 transform rotate-12">
            <div className="w-96 h-96 bg-white rounded-full opacity-5"></div>
          </div>
          <div className="absolute -left-40 bottom-10 transform -rotate-12">
            <div className="w-64 h-64 bg-white rounded-full opacity-5"></div>
          </div>
          <div className="absolute right-1/4 bottom-5">
            <Star className="h-12 w-12 text-white opacity-20" />
          </div>
          <div className="absolute left-1/4 top-20">
            <Star className="h-8 w-8 text-white opacity-20" />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Make a Difference?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Join thousands of communities and organizations that are already creating positive change through CareLink.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/register"
              className="inline-flex items-center px-10 py-5 rounded-full bg-white text-teal-600 font-medium hover:bg-gray-50 transition-all transform hover:scale-105 hover:shadow-lg"
            >
              Join CareLink Today
              <ArrowRight className="ml-2" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center px-10 py-5 rounded-full bg-transparent border-2 border-white text-white font-medium hover:bg-white/10 transition-all transform hover:scale-105"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </div>
      </div>        
  );
};
  

export default LandingPage;