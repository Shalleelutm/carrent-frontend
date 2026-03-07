function predictDemand(bookings) {

  const demand = {};

  bookings.forEach(b => {

    const location = b.pickup_location || "unknown";

    if (!demand[location]) {
      demand[location] = 0;
    }

    demand[location]++;

  });

  return demand;
}

module.exports = { predictDemand };