import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";
import Customer from "../utils/errors/customError.js";
import EErrors from "../utils/errors/enums.js";
import { generatePetCreatedErrorInfo } from "../utils/errors/info.js";

const getAllPets = async(req,res)=>{
    const pets = await petsService.getAll();
    res.send({status:"success",payload:pets})
}

const getPet = async(req,res)=>{
    const petId = req.params.pid;
    const pet = await petsService.getBy({_id:petId});
    if(!pet) return res.status(404).send({status:'error', error:'Pet not found'});
    res.send({status:"success",payload:pet})
}

const createPet = async(req,res, next)=> {
    const {name,specie,birthDate} = req.body;

    try {
        if(!name||!specie||!birthDate){
            Customer.createError({
                name:"Pet creation Error",
                cause:generatePetCreatedErrorInfo({name, specie, birthDate}),
                message:"Error trying to create pet",
                code:EErrors.INVALID_TYPES_ERROR
            })
        }
        const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
    } catch (error) {
        next(error)
    }   
}

const updatePet = async(req,res) =>{
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    const result = await petsService.update(petId,petUpdateBody);
    res.send({status:"success",message:"pet updated"})
}

const deletePet = async(req,res)=> {
    const petId = req.params.pid;
    const result = await petsService.delete(petId);
    res.send({status:"success",message:"pet deleted"});
}

const createPetWithImage = async(req,res) =>{
    const file = req.file;
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    console.log(file);
    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image:`${__dirname}/../public/img/${file.filename}`
    });
    console.log(pet);
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}
export default {
    getAllPets,
    getPet,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}