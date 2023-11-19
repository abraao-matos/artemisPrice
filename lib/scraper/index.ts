"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice, extractReviews } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  try {
    // Fetch the product page
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    };

    const response = await axios.get(url, { headers });

    const $ = cheerio.load(response.data);

    // Extract the product title
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
      $(".a-price.a-text-price")
    );

    const originalPrice = extractPrice(
      $("#ppd #corePriceDisplay_desktop_feature_div  #priceblock_ourprice"),
      $(
        "#ppd #corePriceDisplay_desktop_feature_div  .a-price.a-text-price span.a-offscreen"
      ),
      $("#ppd  #corePriceDisplay_desktop_feature_div #listPrice"),
      $("#ppd  #corePriceDisplay_desktop_feature_div #priceblock_dealprice"),
      $(
        "#ppd #corePriceDisplay_desktop_feature_div  .a-size-base.a-color-price"
      )
    );

    const messageTextElement = $(
      "#social-proofing-faceout-title-tk_bought .social-proofing-faceout-title-text"
    );

    console.log(messageTextElement);

    const messageText = messageTextElement.text().trim();

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(images));

    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
    const reviews = extractReviews($("#ppd #acrCustomerReviewText"));

    const data = {
      url,
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category",
      reviewsCount: Number(reviews),
      stars: 5,
      isOutOfStock: outOfStock,
      message: messageText,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
