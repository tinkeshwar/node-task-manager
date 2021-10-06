---
to: database/migrations/<%= h.timestamp() %>-<%= h.inflection.classify(name) %>.js
---

'use strict'


module.exports = {
    up: async(QueryInterface, Sequelize) =>{
        const {DataTypes} = Sequelize;
        await QueryInterface.createTable('<%= h.inflection.underscore(h.inflection.pluralize(name)) %>',{
            id: {type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
           
            status: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0},
            deletedAt: {type: DataTypes.DATE, allowNull: true, field:'deleted_at'},
            createdAt: {type: DataTypes.DATE, allowNull: false, field:'created_at'},
            updatedAt: {type: DataTypes.DATE, allowNull: false, field:'updated_at'},
        });
        
    },

    down: async(QueryInterface)=>{
        await QueryInterface.dropTable('<%= h.inflection.underscore(h.inflection.pluralize(name)) %>');
    }
}
