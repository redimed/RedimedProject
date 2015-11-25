//
//  rteleEmployee.h
//  telehealth
//
//  Created by Khoa Nguyen on 7/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface rteleEmployee : NSObject{
    NSString *eid;
    NSString *employerId;
    NSString *fname;
    NSString *gname;
    NSString *dob;
    NSString *address;
    NSString *status;
}
@property (retain, nonatomic) NSString *eid;
@property (retain, nonatomic) NSString *employerId;
@property (retain, nonatomic) NSString *fname;
@property (retain, nonatomic) NSString *gname;
@property (retain, nonatomic) NSString *dob;
@property (retain, nonatomic) NSString *address;
@property (retain, nonatomic) NSString *status;
@property (nonatomic, strong) NSString *entryID;
@end
