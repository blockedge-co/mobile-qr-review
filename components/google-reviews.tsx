"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface GoogleReviewsProps {
  isLoaded: boolean;
}

export function GoogleReviews({ isLoaded }: GoogleReviewsProps) {
  const googleReviewLink = "https://g.page/r/CR3unGfg4PLtEBM/review"

  return (
    <Card
      className={`p-6 border-0 shadow-lg transition-all duration-700 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: "1300ms" }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Leave a Review</h2>

      <div className="text-center">
        <p className="text-gray-700 mb-4 px-2 text-sm sm:text-base">Help us improve by leaving a review on Google!</p>
        <Button
          onClick={() => window.open(googleReviewLink, "_blank")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full sm:w-auto"
        >
          <Star className="h-5 w-5 mr-2 fill-current text-yellow-400 flex-shrink-0" />
          <span className="truncate">Write a Google Review</span>
        </Button>
      </div>
    </Card>
  )
}