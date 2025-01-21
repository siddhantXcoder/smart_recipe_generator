"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

const SearchRecipe: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ingredients: "", diet: "" });
  const [favorites, setFavorites] = useState<Set<number>>(new Set()); // Store favorite recipe IDs

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchRecipes = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { ingredients, diet } = formData;
    if (!ingredients) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredients}&diet=${diet}&number=5`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "a0ff0629b7bc4c349d6877f707250297",
          },
        }
      );

      if (response.status === 200) {
        setRecipes(response.data.results);
      } else {
        throw new Error("Failed to fetch recipes");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error fetching recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updatedFavorites = new Set(prev);
      if (updatedFavorites.has(id)) {
        updatedFavorites.delete(id); // Remove from favorites
      } else {
        updatedFavorites.add(id); // Add to favorites
      }
      return updatedFavorites;
    });
  };

  return (
    <div className="flex items-center justify-center flex-col p-6">
      <h1 className="text-4xl font-bold mb-8 text-white">Find Your Perfect Recipe</h1>
      <form
        onSubmit={fetchRecipes}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients
          </label>
          <input
            type="text"
            name="ingredients"
            placeholder="e.g., tomatoes, cheese"
            value={formData.ingredients}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Preferences
          </label>
          <select
            name="diet"
            value={formData.diet}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">No preference</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten free">Gluten-Free</option>
            <option value="ketogenic">Ketogenic</option>
            <option value="pescatarian">Pescatarian</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-600 transition duration-300"
        >
          Search Recipes
        </button>
      </form>

      {loading && <p className="mt-6 text-indigo-500">Loading...</p>}
      {error && <p className="mt-6 text-red-500">{error}</p>}

      <div className="mt-8 w-11/12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className={`bg-white rounded-lg shadow-lg p-4 text-center hover:shadow-xl transition duration-300 ${
              favorites.has(recipe.id) ? "border-2 border-yellow-400" : ""
            }`}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-2">{recipe.title}</h2>
            <img
              src={recipe.image}
              alt={recipe.title}
              className="rounded-md w-full h-40 object-cover"
            />
            <button
              onClick={() => toggleFavorite(recipe.id)}
              className={`mt-4 px-4 py-2 rounded-md text-white ${
                favorites.has(recipe.id)
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gray-500 hover:bg-gray-600"
              } transition duration-300`}
            >
              {favorites.has(recipe.id) ? "Unfavorite" : "Favorite"}
            </button>
            <Link
              href={`https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-blue-500 hover:underline"
            >
              View Recipe
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchRecipe;
