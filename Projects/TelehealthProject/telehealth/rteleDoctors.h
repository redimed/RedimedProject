//
//  rteleDoctors.h
//  telehealth
//
//  Created by Khoa Nguyen on 27/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "rteleDoctor.h"

@interface rteleDoctors : NSObject{
    rteleDoctor *entry;
    NSData* responseData;
}
@property (retain, nonatomic) NSData* responseData;
@property (retain, nonatomic) rteleDoctor* entry;
-(NSMutableArray*)loadData:(NSString*)eid;
-(rteleDoctor*)loadDataWithId:(NSString*)eid;
-(rteleDoctor*)loadDataWithCompanyId:(NSString*)eid;

@end
