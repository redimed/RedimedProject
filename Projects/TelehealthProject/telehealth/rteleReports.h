//
//  rteleReports.h
//  telehealth
//
//  Created by Khoa Nguyen on 20/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "rteleReport.h"
@interface rteleReports : NSObject{
    rteleReport *report;
    NSData* responseData;
}
@property (retain, nonatomic) NSData* responseData;
@property (retain, nonatomic) rteleReport* report;
-(NSMutableArray*)loadDataWithEntryId:(NSString*)eid;

@end
