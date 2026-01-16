import { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Note: 'localhost' works here because the browser runs on the same laptop as the backend
    try {
      const response = await fetch('http://localhost:3000/add-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("✅ Food Added Successfully!");
        setFormData({ name: '', price: '', image: '' }); // Clear form
      } else {
        alert("❌ Error adding food");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server Connection Failed");
    }
    setLoading(false);
  };

  return (
    <div className="admin-container">
      <div className="card">
        <h1>👨‍🍳 Admin Dashboard</h1>
        <p>Add new items to your Zomato Clone menu</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Food Name</label>
            <input
              name="name"
              placeholder="e.g. Chicken Biryani"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Price (₹)</label>
            <input
              name="price"
              type="number"
              placeholder="e.g. 250"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Image URL</label>
            <input
              name="image"
              placeholder="https://..."
              value={formData.image}
              onChange={handleChange}
              required
            />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="image-preview" />
            )}
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Adding..." : "Add to Menu"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;