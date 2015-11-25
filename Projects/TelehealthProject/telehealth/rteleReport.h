//
//  rteleReport.h
//  telehealth
//
//  Created by Khoa Nguyen on 20/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface rteleReport : NSObject{
    NSString *createdTime;
    NSString *rid;
    NSString *updatedTime;
    NSString *eid;
    NSString *type;
    NSDictionary *detail;
}
@property (retain, nonatomic) NSMutableData* responseData;
@property (nonatomic,retain) NSString *rid;
@property (nonatomic,retain) NSString *type;
@property (nonatomic,retain) NSString *createdTime;
@property (nonatomic,retain) NSString *updatedTime;
@property (nonatomic,retain) NSString *eid;
@property (nonatomic,retain) NSDictionary *detail;

//-(void)loadData;

@end
