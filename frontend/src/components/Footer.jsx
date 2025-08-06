import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  BookOpen,
  Users,
  GraduationCap,
  Heart,
  ArrowRight,
  Computer,
  Sparkles
} from 'lucide-react';


const Footer = () => {
  const currentYear = new Date().getFullYear();


  const quickLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Subjects', href: '/subjects' },
    { name: 'Profile', href: '/profile' },
    { name: 'Syllabus', href: 'Syllabus.html', external: true },
    { name: 'Datesheet', href: 'Datesheet.html', external: true }
  ];


  const resources = [
    { name: 'Study Materials', href: '/subjects',target:null },
    { name: 'Academic Calendar', href: 'Calender.html',target:"new" },
  ];


  const socialLinks = [
    { icon: Github, href: 'https://github.com/gangasingh007', label: 'GitHub' },
    { icon: Twitter, href: 'https://x.com/gangasingh1734', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/ganga-singh-0156b323a/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/ganga.singh.007/', label: 'Instagram' }
  ];


  const features = [
    { icon: BookOpen, title: 'Access Subjects', description: 'Comprehensive learning resources' },
    { icon: Users, title: 'Community', description: 'Connect with peers and faculty (soon)' },
    { icon: Sparkles, title: 'AI summarization', description: 'Single Click Summarization' }
  ];


  return (
    <footer className="relative bg-gradient-to-br from-[#0a0a0f] via-[#04040a] to-[#05050a] border-t border-[#2a2a40] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 blur-[100px] rounded-full -top-20 -left-20"></div>
        <div className="absolute w-[300px] h-[300px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 blur-[80px] rounded-full -bottom-10 -right-10"></div>
       
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      </div>


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
         
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <motion.h3
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                UniConnect
              </motion.h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering students with comprehensive academic resources, seamless connectivity,
                and tools for educational excellence in the digital age.
              </p>
            </div>


            {/* Features Highlight */}
            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="flex items-center gap-3 group cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{feature.title}</p>
                      <p className="text-gray-500 text-xs">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>


          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-purple-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>


          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Resources
            </h4>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <motion.li
                  key={resource.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    target={resource.target}
                    href={resource.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {resource.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>


          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              Connect
            </h4>
           
            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>gangasingh1734@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+91-7087550589</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-green-400" />
                <span>Ludhiana, Punjab</span>
              </div>
            </div>


            {/* Social Links */}
            <div>
              <p className="text-gray-400 text-sm mb-3">Follow</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className="p-2 rounded-lg bg-[#252540] hover:bg-[#2f2f4a] text-gray-400 hover:text-white transition-all duration-300 group"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      target='new'
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>


        {/* Bottom Section */}
        <motion.div
          className="pt-8 border-t border-[#2a2a40]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© {currentYear} UniConnect. Developed with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-400 fill-current" />
              </motion.div>
              <span>by - Ganga Singh</span>
            </div>
           
          </div>
        </motion.div>
      </div>
    </footer>
  );
};


export default Footer;
