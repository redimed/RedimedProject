//
//  rteleDoctors.m
//  telehealth
//
//  Created by Khoa Nguyen on 27/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleDoctors.h"
#import "SBJson.h"
#import "constants.h"
#import "rteleAppDelegate.h"
@implementation rteleDoctors

@synthesize responseData = responseData;
@synthesize entry = entry;

-(NSMutableArray*)loadData:(NSString*)cid{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/members/%@/?token=%@", cid,[defaults valueForKey:@"tokenUser"]]];
    
    SBJsonParser *parser = [[SBJsonParser alloc] init];
    
    NSDictionary* json = [[parser objectWithString:retval] copy];
    
    NSMutableArray* entries = [NSMutableArray arrayWithCapacity:[json count]];
    for (NSDictionary *row in json) {
        rteleDoctor *entry2 = [[rteleDoctor alloc] init];
        entry2.mid = [row objectForKey:@"id"];
        entry2.cid = [row objectForKey:@"companyId"];
        entry2.username = [row objectForKey:@"username"];
        entry2.password = [row objectForKey:@"password"];
        entry2.type = [row objectForKey:@"type"];
        entry2.lastLogin = [row objectForKey:@"lastlogin"];
        entry2.createdTime = [row objectForKey:@"createdTime"];
        entry2.updatedTime = [row objectForKey:@"updatedTime"];
        entry2.detail = [row objectForKey:@"detail"];
        entry2.isOperation = [[row valueForKey:@"isOperation"] integerValue];
        entry2.isNotification = [[row valueForKey:@"isNotification"] integerValue];
        
        entry2.isInvoiced = [[row valueForKey:@"isInvoiced"] integerValue];
        entry2.isPush = [[row valueForKey:@"isPush"] integerValue];
        //NSLog(@"%@", entry2.detail);
        [entries addObject:entry2];
    }
    //NSLog(@"%@", retval);
    return entries;
}
-(rteleDoctor*)loadDataWithId:(NSString*)eid{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/member/%@/?token=%@", eid,[defaults objectForKey:@"tokenUser"]]];
    
    SBJsonParser *parser = [[SBJsonParser alloc] init];
    
    NSDictionary* json = [[parser objectWithString:retval] copy];
    //NSLog(@"single-%@",json);
    rteleDoctor *entry2 = [[rteleDoctor alloc] init];
    entry2.mid = [json objectForKey:@"id"];
    entry2.cid = [json objectForKey:@"companyId"];
    entry2.username = [json objectForKey:@"username"];
    entry2.password = [json objectForKey:@"password"];
    entry2.type = [json objectForKey:@"type"];
    entry2.lastLogin = [json objectForKey:@"lastlogin"];
    entry2.createdTime = [json objectForKey:@"createdTime"];
    entry2.updatedTime = [json objectForKey:@"updatedTime"];
    entry2.detail = [json objectForKey:@"detail"];
    
    //add
    entry2.isNotification = [[json valueForKey:@"isNotification"] integerValue];
    entry2.isOperation = [[json valueForKey:@"isOperation"] integerValue];
    entry2.isInvoiced = [[json valueForKey:@"isInvoiced"] integerValue];
    entry2.isPush = [[json valueForKey:@"isPush"] integerValue];
    //end
    //entry2.detail = [[parser objectWithString:[json objectForKey:@"detail"]] copy];
    //NSLog(@"single-%@",entry2.eid);
    return entry2;
}
-(rteleDoctor*)loadDataWithCompanyId:(NSString*)eid{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/memberComp/%@/?token=%@", eid,[defaults objectForKey:@"tokenUser"]]];
    
    SBJsonParser *parser = [[SBJsonParser alloc] init];
    
    NSDictionary* json = [[parser objectWithString:retval] copy];
    //NSLog(@"single-%@",json);
    rteleDoctor *entry2 = [[rteleDoctor alloc] init];
    entry2.mid = [json objectForKey:@"id"];
    entry2.cid = [json objectForKey:@"companyId"];
    entry2.username = [json objectForKey:@"username"];
    entry2.password = [json objectForKey:@"password"];
    entry2.type = [json objectForKey:@"type"];
    entry2.lastLogin = [json objectForKey:@"lastlogin"];
    entry2.createdTime = [json objectForKey:@"createdTime"];
    entry2.updatedTime = [json objectForKey:@"updatedTime"];
    NSString *detailEmployer = [json objectForKey:@"detailEmployer"];
    
    //add
    entry2.isNotification = [[json valueForKey:@"isNotification"] integerValue];
    entry2.isOperation = [[json valueForKey:@"isOperation"] integerValue];
    entry2.isInvoiced = [[json valueForKey:@"isInvoiced"] integerValue];
    entry2.isPush = [[json valueForKey:@"isPush"] integerValue];
    //end
    
    NSDictionary *JSON = nil;
    if (![detailEmployer isEqual:[NSNull null]] && detailEmployer) {
        NSError *e = nil;
        JSON =
        [NSJSONSerialization JSONObjectWithData: [[json objectForKey:@"detailEmployer"] dataUsingEncoding:NSUTF8StringEncoding]
                                        options: NSJSONReadingMutableContainers
                                          error: &e];
    }

    //
    entry2.dictJson = JSON;
    return entry2;
}
@end
