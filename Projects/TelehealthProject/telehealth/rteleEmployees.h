//
//  rteleEmployees.h
//  telehealth
//
//  Created by Khoa Nguyen on 7/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "rteleEmployee.h"
@interface rteleEmployees : NSObject{
    rteleEmployee *employee;
    NSData* responseData;
}
@property (retain, nonatomic) NSData* responseData;
@property (retain, nonatomic) rteleEmployee* employee;
-(NSMutableArray*)loadData:(NSInteger) index;
-(rteleEmployee*)loadDataWithId:(NSString*)eid;

@end
