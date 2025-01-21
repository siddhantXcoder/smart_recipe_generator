"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [randomRecipes, setRandomRecipes] = useState<any[]>([]); // Changed to store an array of recipes
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchRandomRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("https://api.spoonacular.com/recipes/random", {
        params: {
          number: 10, // Get 10 random recipes
          includeNutrition: true, // Include nutrition info
          apiKey: "a0ff0629b7bc4c349d6877f707250297", // Replace with your API key
        },
      });

      if (response.status === 200) {
        setRandomRecipes(response.data.recipes); // Set the recipes array
      } else {
        throw new Error("Failed to fetch random recipes");
      }
    } catch (err) {
      setError("Error fetching random recipes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomRecipes();
  }, []);

  const navigateToSearch = () => {
    router.push("/search");
  };

  const navigateToImageSearch = () => {
    router.push("/search-by-image");
  };

  return (
    <div className="flex items-center justify-center flex-col w-full min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <h1 className="text-4xl font-bold text-blue-600 mb-10 text-center">
        Smart Recipe Generator
      </h1>

      <div className="flex space-x-6 mb-8">
        {/* Search Recipe Button */}
        <div
          onClick={navigateToSearch}
          className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-105"
        >
          Search Recipe
        </div>

        {/* Search Recipe by Image Button */}
        <div
          onClick={navigateToImageSearch}
          className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-105"
        >
          Search Recipe by Image
        </div>
      </div>

      {/* Random Recipes Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 w-full max-w-screen-xl p-6">
        {loading ? (
          <p className="text-lg text-center text-gray-700">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : randomRecipes.length > 0 ? (
          randomRecipes.map((recipe, index) => (
            <div key={index} className="flex flex-col items-center bg-white shadow-2xl rounded-lg p-4 space-y-4">
              <Link
                href={`https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`} // Redirect to Spoonacular recipe page
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{recipe.title}</h2>
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  width={500}
                  height={300}
                  className="rounded-md shadow-md"
                />
              </Link>
              <p className="mt-4 text-lg text-gray-600">
                <strong className="font-medium">Preparation Time:</strong> {recipe.readyInMinutes} minutes
              </p>
              <p className="mt-2 text-lg text-gray-600">
                <strong className="font-medium">Calories:</strong> {recipe.nutrition.nutrients[0].amount} kcal
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No recipes found.</p>
        )}
      </div>
    </div>
  );
}
