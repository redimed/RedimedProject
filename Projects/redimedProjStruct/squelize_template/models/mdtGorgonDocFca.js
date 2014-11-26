module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtGorgonDocFca", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'patientId': { 
    type: DataTypes.INTEGER(11),  
            },
            'fName': { 
    type: DataTypes.STRING(200),  
            },
            'JAF': { 
    type: DataTypes.STRING(200),  
            },
            'DOB': { 
    type: DataTypes.DATE,  
            },
            'DOA': { 
    type: DataTypes.DATE,  
            },
            'IsConsentReason': { 
    type: DataTypes.INTEGER(11),  
                defaultValue: '0',
        },
            'fsign': { 
    type: DataTypes.BLOB,  
            },
            'fsignDate': { 
    type: DataTypes.DATE,  
            },
            'Estimated': { 
    type: DataTypes.INTEGER(11),  
            },
            'EstimatedComments': { 
    type: DataTypes.STRING(200),  
            },
            'MS_HeartConditions': { 
    type: DataTypes.INTEGER(11),  
            },
            'MS_HeartConditions_Comment': { 
    type: DataTypes.STRING(200),  
            },
            'MS_Lung_Asthma': { 
    type: DataTypes.INTEGER(11),  
            },
            'MS_Lung__Asthma_Comment': { 
    type: DataTypes.STRING(200),  
            },
            'MS_Diabetes': { 
    type: DataTypes.INTEGER(11),  
            },
            'MS_Diabetes_Comment': { 
    type: DataTypes.STRING(200),  
            },
            'MS_Fits': { 
    type: DataTypes.INTEGER(11),  
            },
            'MS_Fits_Comment': { 
    type: DataTypes.STRING(200),  
            },
            'MS_Medication': { 
    type: DataTypes.INTEGER(11),  
            },
            'MS_Medication_Comment': { 
    type: DataTypes.STRING(200),  
            },
            'MS_Other': { 
    type: DataTypes.INTEGER(11),  
            },
            'MS_Other_Comment': { 
    type: DataTypes.STRING(200),  
            },
            'MS_ie_Comment': { 
    type: DataTypes.STRING(200),  
            },
            'MS_Mx_Heart_Rage_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'MS_Mx_Heart_Rage_2': { 
    type: DataTypes.FLOAT,  
            },
            'MS_Mx_Weight_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'MS_MX_Weight_2': { 
    type: DataTypes.FLOAT,  
            },
            'MS_Blood_Pressure_1': { 
    type: DataTypes.INTEGER(11),  
            },
            'MS_Blood_Pressure_2': { 
    type: DataTypes.INTEGER(11),  
            },
            'MS_Resting_Heart_Rate': { 
    type: DataTypes.INTEGER(11),  
            },
            '1Rom_Neck': { 
    type: DataTypes.INTEGER(11),  
            },
            '1Rom_Thoracic': { 
    type: DataTypes.INTEGER(11),  
            },
            '1Rom_Lumbar': { 
    type: DataTypes.INTEGER(11),  
            },
            '1Rom_Shoulder': { 
    type: DataTypes.INTEGER(11),  
            },
            '1Rom_Elbow': { 
    type: DataTypes.INTEGER(11),  
            },
            '1Rom_Wrist': { 
    type: DataTypes.INTEGER(11),  
            },
            '1Rom_Fingers': { 
    type: DataTypes.INTEGER(11),  
            },
            '1Rom_Hips': { 
    type: DataTypes.INTEGER(11),  
            },
            '1Rom_Knees': { 
    type: DataTypes.INTEGER(11),  
            },
            '1Rom_Ankles': { 
    type: DataTypes.INTEGER(11),  
            },
            '1Rom_Comments': { 
    type: DataTypes.STRING(200),  
            },
            '1Rom_Total': { 
    type: DataTypes.INTEGER(11),  
            },
            '2Heart_Rate_30S': { 
    type: DataTypes.INTEGER(11),  
            },
            '2Heart_Rate_1M': { 
    type: DataTypes.INTEGER(11),  
            },
            '2Heart_Rate_1M_30S': { 
    type: DataTypes.INTEGER(11),  
            },
            '2Heart_Rate_2M': { 
    type: DataTypes.INTEGER(11),  
            },
            '2Heart_Rate_2M_30S': { 
    type: DataTypes.INTEGER(11),  
            },
            '2Heart_Rate_3M': { 
    type: DataTypes.INTEGER(11),  
            },
            '2Heart_Rate_1M_Post': { 
    type: DataTypes.INTEGER(11),  
            },
            '2Step_Result': { 
    type: DataTypes.INTEGER(11),  
            },
            '2Step_Correct': { 
    type: DataTypes.INTEGER(11),  
            },
            '2Comments': { 
    type: DataTypes.STRING(200),  
            },
            '2Total': { 
    type: DataTypes.INTEGER(11),  
            },
            '3a_Right': { 
    type: DataTypes.FLOAT,  
            },
            '3a_Left': { 
    type: DataTypes.FLOAT,  
            },
            '3b_Right': { 
    type: DataTypes.FLOAT,  
            },
            '3b_Left': { 
    type: DataTypes.FLOAT,  
            },
            '3c_Grip': { 
    type: DataTypes.INTEGER(11),  
            },
            '3c_Right': { 
    type: DataTypes.INTEGER(11),  
            },
            '3c_Left': { 
    type: DataTypes.INTEGER(11),  
            },
            '3c_Result': { 
    type: DataTypes.INTEGER(11),  
            },
            '3d_Push_ups_total': { 
    type: DataTypes.INTEGER(11),  
            },
            '3d_Result': { 
    type: DataTypes.INTEGER(11),  
            },
            '3e_total': { 
    type: DataTypes.INTEGER(11),  
            },
            '3e_Result': { 
    type: DataTypes.INTEGER(11),  
            },
            '3Comments': { 
    type: DataTypes.STRING(200),  
            },
            '3Total': { 
    type: DataTypes.FLOAT,  
            },
            '4aSec': { 
    type: DataTypes.INTEGER(11),  
            },
            '4aResult': { 
    type: DataTypes.INTEGER(11),  
            },
            '4bTotal': { 
    type: DataTypes.INTEGER(11),  
            },
            '4bCrepitus': { 
    type: DataTypes.INTEGER(11),  
            },
            '4bResult': { 
    type: DataTypes.INTEGER(11),  
            },
            '4cKneeling': { 
    type: DataTypes.INTEGER(11),  
            },
            '4cResult': { 
    type: DataTypes.INTEGER(11),  
            },
            '4Comments': { 
    type: DataTypes.STRING(200),  
            },
            '4Total': { 
    type: DataTypes.INTEGER(11),  
            },
            '5aPosture': { 
    type: DataTypes.INTEGER(11),  
            },
            '5bHoverResult': { 
    type: DataTypes.FLOAT,  
            },
            '5cStrenght': { 
    type: DataTypes.INTEGER(11),  
            },
            '5cResult': { 
    type: DataTypes.FLOAT,  
            },
            '5dTotal': { 
    type: DataTypes.INTEGER(11),  
            },
            '5dResult': { 
    type: DataTypes.FLOAT,  
            },
            '5eWaitesBow': { 
    type: DataTypes.INTEGER(11),  
            },
            '5eResult': { 
    type: DataTypes.FLOAT,  
            },
            '5fRight': { 
    type: DataTypes.FLOAT,  
            },
            '5fLeft': { 
    type: DataTypes.FLOAT,  
            },
            '5gRight': { 
    type: DataTypes.FLOAT,  
            },
            '5gFloat': { 
    type: DataTypes.FLOAT,  
            },
            '5Total': { 
    type: DataTypes.FLOAT,  
            },
            '6aMax': { 
    type: DataTypes.INTEGER(11),  
            },
            '6aResult': { 
    type: DataTypes.INTEGER(11),  
            },
            '6bMax': { 
    type: DataTypes.INTEGER(11),  
            },
            '6bResult': { 
    type: DataTypes.INTEGER(11),  
            },
            '6c_1': { 
    type: DataTypes.INTEGER(11),  
            },
            '6c_1Comment': { 
    type: DataTypes.STRING(200),  
            },
            '6c_2': { 
    type: DataTypes.INTEGER(11),  
            },
            '6c_2Comment': { 
    type: DataTypes.STRING(200),  
            },
            '6c_3': { 
    type: DataTypes.INTEGER(11),  
            },
            '6c_3Comment': { 
    type: DataTypes.STRING(200),  
            },
            '6c_4': { 
    type: DataTypes.INTEGER(11),  
            },
            '6c_4Comment': { 
    type: DataTypes.STRING(200),  
            },
            '6c_5': { 
    type: DataTypes.INTEGER(11),  
            },
            '6c_5Comment': { 
    type: DataTypes.STRING(200),  
            },
            '6Comments': { 
    type: DataTypes.STRING(200),  
            },
            '6Total': { 
    type: DataTypes.INTEGER(11),  
            },
            'Score1Comment': { 
    type: DataTypes.STRING(200),  
            },
            'Score2Comment': { 
    type: DataTypes.STRING(200),  
            },
            'Score3Comment': { 
    type: DataTypes.STRING(200),  
            },
            'Score4Comment': { 
    type: DataTypes.STRING(200),  
            },
            'Score5Comment': { 
    type: DataTypes.STRING(200),  
            },
            'Score6Comment': { 
    type: DataTypes.STRING(200),  
            },
            'Score7Comment': { 
    type: DataTypes.STRING(200),  
            },
            'Score8Comment': { 
    type: DataTypes.STRING(200),  
            },
            'FCAToTal': { 
    type: DataTypes.FLOAT,  
            },
            'FCAResult': { 
    type: DataTypes.INTEGER(11),  
            },
            'LEPDC': { 
    type: DataTypes.INTEGER(11),  
            },
            'LAPC': { 
    type: DataTypes.INTEGER(11),  
            },
            'LComment': { 
    type: DataTypes.STRING(200),  
            },
            'Lsign': { 
    type: DataTypes.BLOB,  
            },
            'LDate': { 
    type: DataTypes.DATE,  
            },
            'LName': { 
    type: DataTypes.STRING(200),  
            },
            'LPosition': { 
    type: DataTypes.STRING(200),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'CalId': { 
    type: DataTypes.BIGINT(20),  
            },
            'DocId': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "gorgon_doc_fca",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}