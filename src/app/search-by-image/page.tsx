"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const SearchRecipeByImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [probability, setProbability] = useState<number | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!image) return;

      setLoading(true);
      setError(null);
      setRecipes([]);
      setCategory(null);
      setProbability(null);

      const formData = new FormData();
      formData.append("file", image);

      try {
        // Step 1: Classify Image
        const response = await axios.post(
          "https://api.spoonacular.com/food/images/classify",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-api-key": "a0ff0629b7bc4c349d6877f707250297", // Replace with your API key
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          setCategory(data.category); // Set the classified category
          setProbability(data.probability); // Set the probability

          // Step 2: Search Recipes based on classified category
          const recipeResponse = await axios.get(
            `https://api.spoonacular.com/recipes/complexSearch`,
            {
              params: {
                query: data.category, // Use classified category for recipe search
                number: 5, // Get top 5 recipes
                apiKey: "a0ff0629b7bc4c349d6877f707250297", // Replace with your API key
              },
            }
          );

          if (recipeResponse.status === 200) {
            setRecipes(recipeResponse.data.results);
          } else {
            throw new Error("Failed to fetch recipes");
          }
        } else {
          throw new Error("Failed to classify image");
        }
      } catch (err) {
        setError("Error processing the image or fetching recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [image]); // This hook will trigger whenever the image is updated

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Recipe by Image</h1>

      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {/* Image Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

        {/* Preview Selected Image */}
        {image && (
          <div className="mb-4">
            <h3 className="text-sm text-gray-700 mb-2">Selected Image</h3>
            <Image
              src={URL.createObjectURL(image)}
              alt="Selected Image"
              width={300}
              height={200}
              className="rounded-md object-cover"
            />
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={() => setImage(null)} // Reset image selection if needed
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          {loading ? "Processing..." : "Search Recipes"}
        </button>

        {/* Error Message */}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* Classification Result */}
        {category && probability !== null && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">Classification Result</h3>
            <p className="text-gray-600">
              <strong>Category:</strong> {category}
            </p>
            <p className="text-gray-600">
              <strong>Probability:</strong> {(probability * 100).toFixed(2)}%
            </p>
          </div>
        )}

        {/* Recipe Suggestions */}
        {recipes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Recipe Suggestions</h3>
            <ul className="space-y-4 mt-4">
              {recipes.map((recipe) => (
                <li key={recipe.id} className="border-b pb-2">
                  <h4 className="text-lg font-semibold text-gray-700">{recipe.title}</h4>
                  <a
                    href={`https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Recipe
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRecipeByImage;
