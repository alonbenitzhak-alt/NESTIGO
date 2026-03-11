"use client";

import { use, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { properties } from "@/data/properties";
import LeadForm from "@/components/LeadForm";
import { notFound } from "next/navigation";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), { ssr: false });

export default function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const property = properties.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!property) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-primary-600">Properties</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="rounded-2xl overflow-hidden h-[400px] md:h-[500px] mb-3">
                <img
                  src={property.images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-xl overflow-hidden h-24 md:h-28 border-2 transition-all ${
                      i === selectedImage
                        ? "border-primary-500 ring-2 ring-primary-200"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="mb-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.city}, {property.country}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    €{property.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Expected ROI", value: `${property.expected_roi}%`, accent: true },
                  { label: "Bedrooms", value: property.bedrooms.toString() },
                  { label: "Property Type", value: property.property_type },
                  { label: "Country", value: property.country },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gray-50 rounded-xl p-4 text-center"
                  >
                    <div className="text-xs font-semibold text-gray-400 uppercase mb-1">
                      {item.label}
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        item.accent ? "text-accent-600" : "text-gray-900"
                      }`}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Property</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Agent Info */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-gray-900 mb-3">Investment Agent</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {property.agent_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{property.agent_name}</div>
                    <a href={`mailto:${property.agent_email}`} className="text-sm text-primary-600 hover:underline">
                      {property.agent_email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="h-64 rounded-2xl overflow-hidden mb-4">
                <PropertyMap city={property.city} country={property.country} title={property.title} />
              </div>
            </div>
          </div>

          {/* Right Column - Lead Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LeadForm propertyId={property.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
