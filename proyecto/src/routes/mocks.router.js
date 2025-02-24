import { Router } from 'express';
import {faker} from "@faker-js/faker";
import { createHash } from '../utils/index.js';
import { petsService, usersService } from "../services/index.js"

const router = Router();


async function generateMockPets(number) {
    const pets = []
    const speciesList = ["dog","cat","fish"]

    for (let i = 0; i < number; i++) {
        pets.push({
            name:faker.person.firstName(),
            specie: faker.helpers.arrayElement(speciesList),
            birthDate: faker.date.birthdate({min:1, max:15, mode:"age"}).toISOString().split("T")[0]
        }) 
    }
    return pets
}

async function generateMockUsers(number) {
    const users = []
    const roleList = ["user","admin"]
    for (let i = 0; i < number; i++) {
        users.push({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password:await createHash("coder123"),
            role: faker.helpers.arrayElement(roleList),
            pets: []
        })        
    }
    return users
}


router.get("/mockingpets",async(req, res)=>{
    let {numberPets} = req.body
    if (!numberPets){
        numberPets = 100
    }
    const pets = await generateMockPets(numberPets)
    res.send({status:"sucess", payload:pets})
})

router.get("/mockingusers",async(req, res)=>{
    let {numberUsers} = req.body
    if (!numberUsers){
        numberUsers = 50
    }
    const users = await generateMockUsers(numberUsers)
    res.send({status:"sucess", payload:users})
})

router.post("/generateData",async(req, res)=>{
    let {numberUsers,numberPets} = req.body
    if (!numberUsers || !numberPets){
        numberUsers = 10 //Se escogio 10 para no saturar la base de Mongo Gratuita
        numberPets = 10
    }
    const pets = await generateMockPets(numberPets)
    const users = await generateMockUsers(numberUsers)
    const resultPets = await petsService.create(pets);
    const resultUsers = await usersService.create(users);
    res.send({status:"sucess", payload:[...resultPets, ...resultUsers]})
})

export default router;