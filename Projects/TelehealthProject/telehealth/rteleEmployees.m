//
//  rteleEmployees.m
//  telehealth
//
//  Created by Khoa Nguyen on 7/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleEmployees.h"
#import "SBJson.h"
#import "rteleAppDelegate.h"
#import "constants.h"

@implementation rteleEmployees

@synthesize responseData = responseData;
@synthesize employee = employee;

-(NSMutableArray*)loadData:(NSInteger) index{
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    NSLog(@"%@",[defaults objectForKey:@"companyId"]);
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/employees_withPaging/%@/%d/?token=%@", [defaults objectForKey:@"companyId"],index,[defaults objectForKey:@"tokenUser"]]];
    
    SBJsonParser *parser = [[SBJsonParser alloc] init];
    
    NSDictionary* json = [[parser objectWithString:retval] copy];
    //NSLog(@"%@", [userInfo objectAtIndex:0]);
    //NSDictionary *json = [retval JSONValue];
    //NSLog(@"%@", [userInfo objectAtIndex:0]);
    NSMutableArray* entries = [NSMutableArray arrayWithCapacity:[json count]];
    for (NSDictionary *row in json) {
        rteleEmployee *employee2 = [[rteleEmployee alloc] init];
        employee2.address = [row objectForKey:@"address"];
        employee2.employerId = [row objectForKey:@"employerId"];
        employee2.fname = [row objectForKey:@"fname"];
        employee2.gname = [row objectForKey:@"gname"];
        employee2.dob = [row objectForKey:@"dob"];
        employee2.eid = [row objectForKey:@"id"];
        employee2.status = [row objectForKey:@"status"];
        employee2.entryID = [row objectForKey:@"entryID"];
        [entries addObject:employee2];
    }
    
    return entries;
}
-(rteleEmployee*)loadDataWithId:(NSString*)eid{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/employee/%@/?token=%@", eid,[defaults valueForKey:@"tokenUser"]]];
    
    SBJsonParser *parser = [[SBJsonParser alloc] init];
    
    NSDictionary* json = [[parser objectWithString:retval] copy];
    //NSLog(@"single-%@",json);
    rteleEmployee *employee2 = [[rteleEmployee alloc] init];
    employee2.address = [json objectForKey:@"address"];
    employee2.employerId = [json objectForKey:@"employerId"];
    employee2.fname = [json objectForKey:@"fname"];
    employee2.gname = [json objectForKey:@"gname"];
    employee2.dob = [json objectForKey:@"dob"];
    employee2.eid = [json objectForKey:@"id"];
    //NSLog(@"single-%@",employee2.eid);
    return employee2;
}
@end