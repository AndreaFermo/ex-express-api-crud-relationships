const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function store(req, res){
  

  const result = await prisma.category.create({
    data: req.body
  })

  return res.json(result);
}


module.exports = {
  store
}