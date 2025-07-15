
export function renderContactUs(container) {
  container.innerHTML = `
  <div class="container py-5">
  <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
          <div class="card">
              <div class="card-body p-5">
                  <h1 class="text-center mb-4">Contact Us</h1>
                  <form id="contactForm">
                      <div class="mb-3">
                          <label for="name" class="form-label">Name</label>
                          <input 
                              type="text" 
                              class="form-control" 
                              id="name" 
                              placeholder="Enter your name"
                              required
                          >
                      </div>
                      
                      <div class="mb-3">
                          <label for="phone" class="form-label">Phone Number</label>
                          <input 
                              type="tel" 
                              class="form-control" 
                              id="phone" 
                              placeholder="Enter your phone number"
                              required
                          >
                      </div>
                      
                      <div class="mb-4">
                          <label for="message" class="form-label">Message</label>
                          <textarea 
                              class="form-control" 
                              id="message" 
                              rows="5" 
                              placeholder="Enter your message"
                              required
                          ></textarea>
                      </div>
                      
                      <button type="submit" class="btn btn-primary w-100 py-2">
                          Submit Message
                      </button>
                  </form>
              </div>
          </div>
      </div>
  </div>
</div>
  `;
}



