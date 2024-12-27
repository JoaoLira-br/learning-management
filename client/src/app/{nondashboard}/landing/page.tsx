"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCarousel } from "@/hooks/useCarousel";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => {
  return (
    <div className="landing-skeleton">
      <div className="landing-skeleton__hero">
        <div className="loading-skeleton__hero-content">
          <Skeleton className="landing-skeleton__title"></Skeleton>
          <Skeleton className="landing-skeleton__subtitle"></Skeleton>
          <Skeleton className="landing-skeleton__subtitle-secondary"></Skeleton>
          <Skeleton className="landing-skeleton__button"></Skeleton>
        </div>
        <Skeleton className="landing-skeleton__hero-image"></Skeleton>
      </div>
      <div className="landing-skeleton__featured">
        <Skeleton className="landing-skeleton__featured-title"></Skeleton>
        <Skeleton className="landing-skeleton__featured-description"></Skeleton>
        <div className="landing-skeleton__tags">
          {[1,2,3,4,5].map((_,index)=> (
            <Skeleton key={index} className="landing-skeleton__course-card">
              
            </Skeleton>
          ))}
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const currentImage = useCarousel({ totalImages: 3 });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="landing"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="landing__hero"
      >
        <div className="landing__hero-content">
          <h1 className="landing__title">Courses</h1>
          <p className="landing__description">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga
            voluptatem, quidem sunt ex maxime mollitia dolores praesentium
            similique officia omnis.
          </p>
          <div className="landing__cta">
            <Link href="/search">
              <div className="landing__cta-button">Search for Courses</div>
            </Link>
          </div>
        </div>
        <div className="landing__hero-images">
          {["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"].map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`Hero Banner ${index + 1}`}
              fill
              priority={index === currentImage}
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              className={`landing__hero-image ${index === currentImage ? "landing__hero-image--active" : ""}`}
            ></Image>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ amount: 0.3, once: true }}
        className="landing__featured"
      >
        <h2 className="landing__featured-title">Featured Courses</h2>
        <p className="landing__featured-description">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum maxime
          et soluta a laborum error nesciunt voluptas iure dolorum corporis?
        </p>
        <div className="landing__tags">
          {[
            "web development",
            "enterprise IT",
            "react nextjs",
            "javascript",
            "backend development",
          ].map((tag, index) => (
            <span key={index} className="landing__tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="landing__courses">
          {/* {courses display over here} */}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Landing;
