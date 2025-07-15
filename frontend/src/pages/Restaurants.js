// This function now fetches data from your backend API and uses the correct local image path

export async function renderRestaurants(container) {
  // Show a loading message while we fetch data
  container.innerHTML = '<p class="text-center p-5">Loading restaurants...</p>';

  let restaurants = [];
  try {
    const response = await fetch('http://localhost:3001/api/restaurants');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    restaurants = await response.json();
  } catch (error) {
    console.error('Failed to fetch restaurants:', error);
    container.innerHTML = '<p class="text-center text-danger p-5">Could not load restaurants. Is the backend server running?</p>';
    return; // Stop execution if fetch fails
  }

  // Once data is fetched, render the full page
  container.innerHTML = `
    <div>
      <div class="jumbotron">
        <div class="overlay"></div>
        <div class="content">
            <h1>Discover Delicious Dishes</h1>
            <p>Find the perfect recipe for any occasion</p>
            
            <form id="searchForm" class="search-form">
                <div class="search-container">
                    <input  
                        type="text"  
                        id="searchInput"  
                        placeholder="Search for Dishes..."
                        autocomplete="off"
                    >
                    <button type="submit" class="search-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </button>
                </div>
                
                <div class="popular-tags" id="popularTags"></div>
            </form>

            <div id="searchResults" class="search-results"></div>
        </div>
      </div>
      <div class="container py-4">
        <h6 class="mb-4">Choose from nearby restaurants</h6>
        <div class="row g-4">
          ${restaurants.map(restaurant => `
            <div class="col-md-6 col-lg-4">
              <div class="card restaurant-card h-100 shadow-sm">
                <!-- CORRECTED: Image source now points to the local /images folder -->
                <img src="./images/${restaurant.image}" alt="${restaurant.name}" class="card-img-top restaurant-image">
                <div class="card-body">
                  <h5 class="card-title">${restaurant.name}</h5>
                  <p class="card-text text-muted mb-2">${restaurant.cuisine}</p>
                  <p class="card-text">
                    <i class="bi bi-star-fill text-warning"></i> ${restaurant.rating}
                    <span class="mx-2">•</span>
                    <i class="bi bi-clock"></i> ${restaurant.deliveryTime}
                  </p>
                  <a href="#/menu?id=${restaurant.id}" class="btn btn-primary">
                    <i class="bi bi-menu-button-wide"></i> View Menu
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
