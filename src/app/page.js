'use client'

import React, { useState } from 'react';
import Head from 'next/head';
import { 
  FaUserTie, 
  FaUsers, 
  FaChartBar, 
  FaCalendarCheck, 
  FaMoneyBillWave, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaArrowRight, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: <FaUserTie className="text-4xl text-blue-600" />,
      title: "Manajemen Karyawan",
      description: "Kelola data karyawan dengan sistem CRUD lengkap dan terintegrasi."
    },
    {
      icon: <FaUsers className="text-4xl text-green-600" />,
      title: "Departemen & Jabatan",
      description: "Atur struktur organisasi dengan pembagian departemen dan jabatan yang jelas."
    },
    {
      icon: <FaCalendarCheck className="text-4xl text-yellow-600" />,
      title: "Sistem Absensi",
      description: "Pantau kehadiran karyawan dengan sistem absensi yang akurat dan real-time."
    },
    {
      icon: <FaMoneyBillWave className="text-4xl text-purple-600" />,
      title: "Penggajian Dasar",
      description: "Hitung dan kelola penggajian karyawan dengan sistem yang transparan."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-red-600" />,
      title: "Akses Terkontrol",
      description: "Dua level akses (Admin & HR) untuk keamanan data yang optimal."
    },
    {
      icon: <FaChartBar className="text-4xl text-teal-600" />,
      title: "Laporan Ringkas",
      description: "Dashboard dengan laporan sederhana untuk pengambilan keputusan."
    }
  ];

  const benefits = [
    "Menghemat waktu dan mengurangi kesalahan manual",
    "Data karyawan terpusat dan mudah diakses",
    "Sistem absensi yang akurat dan transparan",
    "Perhitungan gaji yang konsisten dan tepat waktu",
    "Akses aman dengan kontrol peran yang jelas"
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FaUserTie className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">HRIS<span className="text-blue-600">Mini</span><span className='text-red-500'>(Ham)</span></h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium">Beranda</a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium">Fitur</a>
              <a href="#benefits" className="text-gray-700 hover:text-blue-600 font-medium">Manfaat</a>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium py-2">Beranda</a>
                <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium py-2">Fitur</a>
                <a href="#benefits" className="text-gray-700 hover:text-blue-600 font-medium py-2">Manfaat</a>
                <a href="#login" className="text-gray-700 hover:text-blue-600 font-medium py-2">Login</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Kelola Karyawan dengan <span className="text-blue-600">Mudah</span> dan <span className="text-blue-600">Efisien</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              HRIS Mini adalah solusi manajemen sumber daya manusia yang sederhana namun lengkap untuk bisnis lokal. 
              Kelola data karyawan, absensi, dan penggajian dalam satu platform terintegrasi.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300 flex items-center justify-center">
                Mulai Sekarang
                <FaArrowRight className="ml-2" />
              </a>
              <a href="#features" className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition duration-300 flex items-center justify-center">
                Pelajari Fitur
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-linear-to-r from-blue-500 to-blue-700 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <FaUserTie className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Dashboard Admin</h3>
                    <p className="text-gray-600">Akses penuh ke semua fitur</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    <span>Kelola Data Karyawan</span>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    <span>Pantau Absensi</span>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    <span>Hitung Penggajian</span>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    <span>Buat Laporan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Utama HRIS Mini</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sistem HRIS sederhana dengan fitur esensial untuk manajemen karyawan yang efektif
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Manfaat Menggunakan HRIS Mini</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Solusi praktis untuk meningkatkan efisiensi manajemen karyawan bisnis Anda
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
              <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Mengapa Memilih HRIS Mini?</h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="text-green-500 mt-1 mr-3 shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white p-4">
                  <h3 className="text-xl font-bold">Sistem 3 Level Akses</h3>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Admin</h4>
                    <p className="text-gray-600">Akses penuh untuk mengelola semua data karyawan, departemen, absensi, Pengguna, dan penggajian.</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">HR</h4>
                    <p className="text-gray-600">Akses terbatas untuk mengelola data karyawan, melihat absensi, dan menginput data gaji.</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2 mt-2.5">Karyawan</h4>
                    <p className="text-gray-600">Fitur dashboard dan absensi</p>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <FaUserTie className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold">HRIS<span className="text-blue-300">Mini</span></h2>
              </div>
              <p className="text-gray-400">Sistem manajemen karyawan sederhana untuk bisnis lokal.</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400">© {new Date().getFullYear()} HRIS Mini. All rights reserved.</p>
              <p className="text-gray-400 mt-2">Versi 1.0 - Untuk penggunaan lokal</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}