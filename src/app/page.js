"use client";

import { useState } from "react";
import axios from "axios";
import { getName } from 'country-list';

export default function Home() {
  const [name, setName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const [ageResponse, genderResponse, nationalityResponse] =
        await Promise.all([
          axios.get(`https://api.agify.io?name=${name}`),
          axios.get(`https://api.genderize.io?name=${name}`),
          axios.get(`https://api.nationalize.io?name=${name}`),
        ]);

      setResult({
        age: ageResponse.data.age,
        gender: genderResponse.data.gender,
        countries: nationalityResponse.data.country.sort(
          (a, b) => b.probability - a.probability
        ),
      });
    } catch (error) {
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-extrabold mb-6 text-center text-gray-900">
          Guess the Age, Gender, and Country
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">Enter a name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>

        {error && <div className="mt-4 text-red-600 text-center font-medium">{error}</div>}

        {result && (
          <div className="mt-6 text-center bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Results for {name}</h2>
            <p className="text-lg font-semibold mb-2">Age: <span className="font-medium text-blue-700">{result.age}</span></p>
            <p className="text-lg font-semibold mb-2">Gender: <span className="font-medium text-blue-700">{result.gender}</span></p>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Probable Nationalities:</h3>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {result.countries.map((country, index) => (
                <li key={index} className="text-lg">
                  {getName(country.country_id)} <span className="text-blue-700">({(country.probability * 100).toFixed(2)}%)</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

