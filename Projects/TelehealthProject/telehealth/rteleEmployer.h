//
//  rteleEmployer.h
//  telehealth
//
//  Created by Khoa Nguyen on 18/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface rteleEmployer : NSObject{
    NSString *name;
    NSString *IMA;
    NSString *address;
    NSString *sname;
    NSString *code;
    NSString *smphone;
    NSString *email;
    NSString *username;
    NSString *smedic;
    NSString *phone;
    NSString *insurer;
    NSString *eid;
}
@property (nonatomic,retain) NSString *name;
@property (nonatomic,retain) NSString *eid;
@property (nonatomic,retain) NSString *IMA;
@property (nonatomic,retain) NSString *address;
@property (nonatomic,retain) NSString *sname;
@property (nonatomic,retain) NSString *code;
@property (nonatomic,retain) NSString *smphone;
@property (nonatomic,retain) NSString *email;
@property (nonatomic,retain) NSString *username;
@property (nonatomic,retain) NSString *smedic;
@property (nonatomic,retain) NSString *phone;
@property (nonatomic,retain) NSString *insurer;

//
@property (nonatomic, strong) NSDictionary *dictJson;
@end