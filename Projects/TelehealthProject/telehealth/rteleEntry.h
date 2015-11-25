//
//  rteleEntry.h
//  telehealth
//
//  Created by Khoa Nguyen on 28/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface rteleEntry : NSObject{
    NSString *createdTime;
    NSString *itype;
    NSString *status;
    NSString *eid;
    NSString *emid;
    NSMutableDictionary *detail;
}
@property (retain, nonatomic) NSMutableData* responseData;
@property (nonatomic,retain) NSString *itype;
@property (nonatomic,retain) NSString *status;
@property (nonatomic,retain) NSString *createdTime;
@property (nonatomic,retain) NSString *eid;
@property (nonatomic,retain) NSString *emid;
@property (nonatomic,retain) NSMutableDictionary *detail;

//-(void)loadData;
@end
