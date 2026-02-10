const {Logger}=require('../config');
class CrudRepository {
    constructor(model){
        this.model = model;
    }
    async create(data){
       
            const response = await this.model.create(data);
            return response;
        
    }
    async destroy(data){
        try {
            const response = await this.model.destroy({
                where:{
                    id:data
                }
            });
            return response;
        } catch (error) {
            Logger.error('Error in crud repository destroy method',error);
            throw error;
        }
    }
    async get(data){
        try {
            const response = await this.model.findByPk(data);
            return response;
        } catch (error) {
            Logger.error('Error in crud repository get method',error);
            throw error;
        }
    }
    async getAll(){
        try {
            const response = await this.model.findAll();
            return response;
        } catch (error) {
            Logger.error('Error in crud repository getAll method',error);
            throw error;
        }
        }
       async update(id,data){//data->{col1:val1, col2:val2...}
        try {
            const response = await this.model.update(data,{ 
                where:{
                    id:id
                }
            });
            return response;
        } catch (error) {
            Logger.error('Error in crud repository update method',error);
            throw error;
        }
         }


}
module.exports = CrudRepository;

