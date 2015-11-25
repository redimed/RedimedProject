//
//  rteleEntries.h
//  telehealth
//
//  Created by Khoa Nguyen on 28/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "rteleEntry.h"
@interface rteleEntries : NSObject{
    rteleEntry *entry;
    NSData* responseData;
}
@property (retain, nonatomic) NSData* responseData;
@property (retain, nonatomic) rteleEntry* entry;
-(NSMutableArray*)loadData:(NSString*)eid;
-(rteleEntry*)loadDataWithId:(NSString*)eid;
@end
