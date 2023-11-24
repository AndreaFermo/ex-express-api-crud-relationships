const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generateSlug } = require("../utilities/controllerUtilities");
const { validationResult } = require("express-validator");

async function index(req, res, next) {
    
    try {
        const { published, search } = req.query;

        let whereCondition = {};

        if (published === "true") {
            whereCondition.published = true; 
        }

        if (published === "false") {
            whereCondition.published = false; 
        }

        if (search) {
            whereCondition.OR = [
                { title: { contains: search } },
                { content: { contains: search } },
            ];
        }

        const result = await prisma.post.findMany({
            where: whereCondition,
            include:{
                tags:true,
                category:true
            }
        });

        res.json({ message: "Post trovati con successo", result });
    }
    catch (error) {
       next(error);
    }
   
};

async function store(req, res, next) {
   
    let requestUpdated;
    try {
        const validation = validationResult(req);
    
    if (!validation.isEmpty()) {
        throw new Error(`${validation.array()[0].msg} ${validation.array()[0].path}`)
    }
    const elements = await prisma.post.findMany();
    
    const request = {...req.body};

    request.slug = generateSlug(request.title, elements);

    requestUpdated = request

    const result = await prisma.post.create({
        data: {
            title: requestUpdated.title,
            slug: requestUpdated.slug,
            content: requestUpdated.content,
            image: requestUpdated.image,
            published: requestUpdated.published,
            categoryId: requestUpdated.categoryId,
            ...(requestUpdated.tags && requestUpdated.tags.length > 0
                ? {
                      tags: {
                          connect: requestUpdated.tags.map((tagId) => ({
                              id: tagId,
                          })),
                      },
                  }
                : {}),
        },
        include:{
            tags:true,
            category:true
        }
    });

    res.json({"message": "post creato correttamente", result})
    } catch (error) {
       next(error);
   }
};

async function update(req, res, next) {
   
    try {
        const validation = validationResult(req);
    
        if (!validation.isEmpty()) {
            throw new Error(`${validation.array()[0].msg} ${validation.array()[0].path}`)
        }

        let requestUpdated;
        if (req.body.title){
           
            
            const elements = await prisma.post.findMany();
            
            const request = {...req.body};

            request.slug = generateSlug(request.title, elements);

            requestUpdated = request
       
        } else {
        requestUpdated = req.body
        }

        const result = await prisma.post.update({
            where: {
                slug: req.params.slug
            },
            data: {
                title: requestUpdated.title,
                slug: requestUpdated.slug,
                content: requestUpdated.content,
                image: requestUpdated.image,
                published: requestUpdated.published,
                categoryId: requestUpdated.categoryId,
                ...(requestUpdated.tags && requestUpdated.tags.length > 0
                    ? {
                          tags: {
                              connect: requestUpdated.tags.map((tagId) => ({
                                  id: tagId,
                              })),
                          },
                      }
                    : {}),
            },
            include:{
                tags:true,
                category:true
            }
        });

        res.json({"message":"post modificato con successo", result})
    } catch (error) {
       next(error);
    }
};

async function show(req, res, next) {
    try {
        const result = await prisma.post.findUnique({
            where: {
                slug: req.params.slug
            },
            include:{
                tags:true,
                category:true
            }
       });

       if (!result){
            const notFoundError = new Error("Risorsa non trovata");
            notFoundError.statusCode = 404;
            throw notFoundError;
       }

       res.json({"message":"post trovato con successo", result});
    }
   catch (error) {
        next(error);
   }
};

async function destroy(req, res, next) {
    try {
        const result = await prisma.post.delete({
            where: {
                slug: req.params.slug
            }
       });

       res.json({"message":"post trovato con successo"});
     
    }
   catch (error) {
        next(error);
   }

};


   

module.exports = {
    index,
    store,
    update,
    show,
    destroy
}