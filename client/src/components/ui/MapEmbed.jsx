export default function MapEmbed() {
  return (
    <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-md">
      <iframe
        title="Humane Care Residential Homes Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.0!2d-77.6!3d37.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s9006+Celestial+Lane%2C+Chesterfield%2C+VA+23832!5e0!3m2!1sen!2sus!4v1"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
