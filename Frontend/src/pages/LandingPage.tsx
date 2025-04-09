import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Building2, Shield, ArrowRight, CheckCircle, Globe, HandHeart, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 overflow-hidden">
      {/* Hero Section with Animation */}
      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2">
            <div className="w-[800px] h-[800px] bg-rose-100 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-center mb-6 animate-bounce">
            <Heart className="h-20 w-20 text-rose-500" fill="currentColor" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-rose-500">CareLink</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Empowering communities and NGOs to create meaningful change together. Join us in making a difference, one connection at a time.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/register"
              className="group px-8 py-4 rounded-full bg-rose-500 text-white font-medium hover:bg-rose-600 transition-all transform hover:scale-105 flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:border-rose-500 hover:text-rose-500 transition-all transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition-transform"
              >
                <div className="inline-flex items-center justify-center p-4 bg-rose-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-rose-500" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CareLink?</h2>
          <p className="text-xl text-gray-600">Discover how we're transforming community support</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Users,
              title: "For Communities",
              description: "Easily report and track local issues, connect with NGOs, and see real impact in your area.",
              color: "bg-blue-500"
            },
            {
              icon: Building2,
              title: "For NGOs",
              description: "Streamline operations, verify issues efficiently, and coordinate responses effectively.",
              color: "bg-green-500"
            },
            {
              icon: Shield,
              title: "For Admins",
              description: "Comprehensive oversight tools to ensure quality and maintain platform integrity.",
              color: "bg-purple-500"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Sparkles className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from our community members</p>
          </div>
          <div className="relative h-[400px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 transform ${
                  index === activeTestimonial
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full mx-auto mb-6 object-cover"
                  />
                  <p className="text-xl text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeTestimonial ? 'bg-rose-500 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-rose-500 py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-[600px] h-[600px] bg-rose-400 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Make a Difference?</h2>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 rounded-full bg-white text-rose-500 font-medium hover:bg-gray-50 transition-all transform hover:scale-105"
          >
            Join CareLink Today
            <ArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;