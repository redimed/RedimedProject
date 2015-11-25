//
//  rteleEmployers.h
//  telehealth
//
//  Created by Khoa Nguyen on 18/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "rteleEmployer.h"

@interface rteleEmployers : NSObject{
    rteleEmployer *employer;
    NSData* responseData;
}
@property (retain, nonatomic) NSData* responseData;
@property (retain, nonatomic) rteleEmployer* employer;
-(NSMutableArray*)loadData;
-(rteleEmployer*)loadDataWithId:(NSString*)eid;
@end
