module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnCertificate", {
            'Certificate_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Claim_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Entity_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Isenable': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'myopinion': { 
    type: DataTypes.STRING(100),  
            },
            'CONSISTENTS': { 
    type: DataTypes.INTEGER(11),  
            },
            'inconsistent': { 
    type: DataTypes.INTEGER(11),  
            },
            'uncertain': { 
    type: DataTypes.INTEGER(11),  
            },
            'comments': { 
    type: DataTypes.STRING(200),  
            },
            'CONDITIONS': { 
    type: DataTypes.STRING(200),  
            },
            'examination': { 
    type: DataTypes.STRING(200),  
            },
            'priorRelevant': { 
    type: DataTypes.STRING(200),  
            },
            'investigations': { 
    type: DataTypes.STRING(200),  
            },
            'complications': { 
    type: DataTypes.STRING(200),  
            },
            'fit_return_nomal_duties': { 
    type: DataTypes.INTEGER(11),  
            },
            'unfit': { 
    type: DataTypes.INTEGER(11),  
            },
            'fit_restricted': { 
    type: DataTypes.INTEGER(11),  
            },
            'fit_modifed': { 
    type: DataTypes.INTEGER(11),  
            },
            'avoid_standing': { 
    type: DataTypes.INTEGER(11),  
            },
            'avoid_walking': { 
    type: DataTypes.INTEGER(11),  
            },
            'avoid_sitting': { 
    type: DataTypes.INTEGER(11),  
            },
            'avoid_squatting': { 
    type: DataTypes.INTEGER(11),  
            },
            'avoid_kneeling': { 
    type: DataTypes.INTEGER(11),  
            },
            'setpsRestriction': { 
    type: DataTypes.INTEGER(11),  
            },
            'avoid_lifting_Over': { 
    type: DataTypes.INTEGER(11),  
            },
            'lifting_over': { 
    type: DataTypes.INTEGER(11),  
            },
            'avoid_elevating_arms': { 
    type: DataTypes.INTEGER(11),  
            },
            'avoid_repetitive_use': { 
    type: DataTypes.INTEGER(11),  
            },
            'avoid_repetitive_bending': { 
    type: DataTypes.INTEGER(11),  
            },
            'avoid_repetitive_lifting': { 
    type: DataTypes.INTEGER(11),  
            },
            'another_comments': { 
    type: DataTypes.STRING(200),  
            },
            'certificate_type': { 
    type: DataTypes.STRING(20),  
            },
            'treatment': { 
    type: DataTypes.STRING(100),  
            },
            'medication': { 
    type: DataTypes.STRING(100),  
            },
            'ismade_contact': { 
    type: DataTypes.INTEGER(11),  
            },
            'isrequire_more_days_off': { 
    type: DataTypes.INTEGER(11),  
            },
            'isreceived_contact_details': { 
    type: DataTypes.INTEGER(11),  
            },
            'iscoordinate_return': { 
    type: DataTypes.INTEGER(11),  
            },
            'isvocational_not_required': { 
    type: DataTypes.INTEGER(11),  
            },
            'isvocational_necessary': { 
    type: DataTypes.INTEGER(11),  
            },
            'vocational_necessary_weeks': { 
    type: DataTypes.INTEGER(11),  
            },
            'isreferred_the_worker': { 
    type: DataTypes.INTEGER(11),  
            },
            'referred_the_worker': { 
    type: DataTypes.STRING(100),  
            },
            'isworker_nominated': { 
    type: DataTypes.INTEGER(11),  
            },
            'worker_nominated': { 
    type: DataTypes.STRING(100),  
            },
            'isinsurer': { 
    type: DataTypes.INTEGER(11),  
            },
            'isvocational_initiated': { 
    type: DataTypes.INTEGER(11),  
            },
            'vocaltional_initiated_with': { 
    type: DataTypes.STRING(100),  
            },
            'more_Comments': { 
    type: DataTypes.STRING(100),  
            },
            'isspecialist_referral': { 
    type: DataTypes.INTEGER(11),  
            },
            'specialist_specialty': { 
    type: DataTypes.STRING(100),  
            },
            'specialist_name': { 
    type: DataTypes.STRING(100),  
            },
            'specialist_date': { 
    type: DataTypes.DATE,  
            },
            'isHospital_referral': { 
    type: DataTypes.INTEGER(11),  
            },
            'hospital_referral': { 
    type: DataTypes.STRING(100),  
            },
            'isallied_referral': { 
    type: DataTypes.INTEGER(11),  
            },
            'allied_specialty': { 
    type: DataTypes.STRING(100),  
            },
            'allied_name': { 
    type: DataTypes.STRING(100),  
            },
            'isrequeire_assestance': { 
    type: DataTypes.INTEGER(11),  
            },
            'reassess_on': { 
    type: DataTypes.DATE,  
            },
            'examined_on': { 
    type: DataTypes.DATE,  
            },
            'lifting_over_note': { 
    type: DataTypes.STRING(250),  
            },
}, {
tableName: "cln_certificates",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}