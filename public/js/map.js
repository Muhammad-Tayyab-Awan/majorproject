mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  center: listing.geometry.coordinates,
  zoom: 9,
});
const marker = new mapboxgl.Marker({ color: "#ff385c" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
      )
      .setMaxWidth("300px")
  )
  .addTo(map);
map.on("load", () => {
  map.loadImage(
    "https://cdn-icons-png.flaticon.com/128/795/795653.png",
    (error, image) => {
      if (error) throw error;
      map.addImage("compass", image);
      map.addSource("point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: listing.geometry.coordinates,
              },
            },
          ],
        },
      });
      map.addLayer({
        id: "points",
        type: "symbol",
        source: "point",
        layout: {
          "icon-image": "compass",
          "icon-size": 0.25,
        },
      });
    }
  );
});
