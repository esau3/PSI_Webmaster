#! /usr/bin/env node

console.log(
  'This script populates some test heroes and pets to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Hero = require("./models/hero");
const Pet = require("./models/pet");

const pets = [];
const heroes = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createPets();
  await createHeroes();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function petCreate(index, name) {
  const pet = new Pet({ name: name });
  await pet.save();
  pets[index] = pet;
  console.log(`Added pet: ${name}`);
}

async function heroCreate(index, name, pet) {
  const herodetail = { 
    name: name,
    pet: pet,
  };
  if (name != false) herodetail.name = name;
  if (pet != false) herodetail.pet = pet;

  const hero = new Hero(herodetail);

  await hero.save();
  heroes[index] = hero;
  console.log(`Added hero: ${name}`);
}

async function createPets() {
  console.log("Adding pets");
  await Promise.all([
    petCreate(0, "AAA"),
    petCreate(1, "BBB"),
    petCreate(2, "CCC"),
    petCreate(3, "DDD"),
    petCreate(4, "EEE"),
    petCreate(5, "FFF"),
    petCreate(6, "GGG"),
    petCreate(7, "HHH"),
    petCreate(8, "III"),
  ]);
}

async function createHeroes() {
  console.log("Adding heroes");
  await Promise.all([
    heroCreate(0, "Dr. Nice", pets[0]),
    heroCreate(1, "Bombasto", pets[1]),
    heroCreate(2, "Celeritas", pets[2]),
    heroCreate(3, "Magneta", pets[3]),
    heroCreate(4, "RubberMan", pets[4]),
    heroCreate(5, "Dynama", pets[5]),
    heroCreate(6, "Dr. IQ", pets[6]),
    heroCreate(7, "Magma", pets[7]),
    heroCreate(8, "Tornado", pets[8]),

  ]);
}