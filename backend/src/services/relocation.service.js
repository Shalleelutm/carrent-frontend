function relocateFleet(cars, demandMap) {

  const recommendations = [];

  cars.forEach(car => {

    const target = Object.keys(demandMap)
      .sort((a,b) => demandMap[b] - demandMap[a])[0];

    recommendations.push({
      car_id: car.id,
      move_to: target
    });

  });

  return recommendations;
}

module.exports = { relocateFleet };