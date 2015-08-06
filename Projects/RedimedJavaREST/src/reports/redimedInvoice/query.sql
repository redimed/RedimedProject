 SELECT header.`INVOICE_DATE`,header.`INVOICE_NUMBER`,
 line.*,item.`ITEM_NAME`,item.`ITEM_CODE`,
 insurer.`id` AS INSURER_ID,insurer.`insurer_name` AS INSURER_NAME,insurer.`address` AS INSURER_ADDRESS,
 insurer.`postcode` AS INSURER_POSTCODE,insurer.`phone` AS INSURER_PHONE,
 company.`id` AS COMPANY_ID, company.`Company_name` AS COMPANY_NAME, company.`Addr` AS COMPANY_ADDRESS,
 company.`postcode` AS COMPANY_POSTCODE, company.`Phone` AS COMPANY_PHONE,
 patient.`Patient_id` AS PATIENT_ID,patient.`First_name` AS PATIENT_FIRST_NAME,
 patient.`Sur_name` AS PATIENT_SURNAME,patient.`Address1` AS PATIENT_ADDRESS1,
 patient.`Address2` AS PATIENT_ADDRESS2,patient.`Post_code` AS PATIENT_POSTCODE,
 patient.`Work_phone` AS PATIENT_WORKPHONE,patient.`Home_phone` AS PATIENT_HOMEPHONE,
 patient.`Mobile` AS PATIENT_MOBILE,
 feeGroup.`FEE_GROUP_ID` AS FEE_GROUP_ID, feeGroup.`CONTACT_ADDRESS` AS FEE_GROUP_ADDRESS,
 feeGroup.`POSTCODE` AS FEE_GROUP_ADDRESS
 FROM `cln_invoice_header` header
 INNER JOIN `cln_invoice_lines` line ON header.`header_id`=line.`HEADER_ID`
 INNER JOIN `inv_items` item ON line.`ITEM_ID`=item.`ITEM_ID`
 LEFT JOIN `cln_insurers` insurer ON header.`Insurer_id`=insurer.`id`
 LEFT JOIN `companies` company ON company.`id` =header.`Company_id`
 LEFT JOIN `cln_patients` patient ON header.`Patient_id`=patient.`Patient_id`
 LEFT JOIN `cln_fee_group` feeGroup ON feeGroup.`FEE_GROUP_ID`=header.`SOURCE_ID`
WHERE header.`header_id`=?