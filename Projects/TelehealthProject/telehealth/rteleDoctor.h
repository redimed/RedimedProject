//
//  rteleDoctor.h
//  telehealth
//
//  Created by Khoa Nguyen on 27/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface rteleDoctor : NSObject{
    NSString *mid;
    NSString *cid;
    NSString *username;
    NSString *password;
    NSString *type;
    NSString *lastLogin;
    NSString *createdTime;
    NSString *updatedTime;
    NSMutableDictionary *detail;
}
@property (nonatomic,retain) NSString *mid;
@property (nonatomic,retain) NSString *cid;
@property (nonatomic,retain) NSString *createdTime;
@property (nonatomic,retain) NSString *updatedTime;
@property (nonatomic,retain) NSString *type;
@property (nonatomic,retain) NSString *username;
@property (nonatomic,retain) NSString *password;
@property (nonatomic,retain) NSString *lastLogin;
@property (nonatomic,retain) NSMutableDictionary *detail;

@property (nonatomic) NSInteger isNotification;
@property (nonatomic) NSInteger isOperation;

@property (nonatomic) NSInteger isInvoiced;

@property (nonatomic) NSInteger isPush;
//
@property (nonatomic, strong) NSDictionary *dictJson;
@end
