//
//  rteleEmployers.m
//  telehealth
//
//  Created by Khoa Nguyen on 18/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleEmployers.h"
#import "SBJson.h"
#import "rteleAppDelegate.h"
#import "constants.h"

@implementation rteleEmployers

@synthesize responseData = responseData;
@synthesize employer = employer;

-(NSMutableArray*)loadData{
//    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:@"json/employers"];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/employers/?token=%@",[defaults objectForKey:@"tokenUser"]]];
    
    SBJsonParser *parser = [[SBJsonParser alloc] init];
    
    NSDictionary* json = [[parser objectWithString:retval] copy];
    //NSLog(@"%@", [userInfo objectAtIndex:0]);
    //NSDictionary *json = [retval JSONValue];
    //NSLog(@"%@", [userInfo objectAtIndex:0]);
    NSMutableArray* entries = [NSMutableArray arrayWithCapacity:[json count]];
    for (NSDictionary *row in json) {
        rteleEmployer *employee2 = [[rteleEmployer alloc] init];
        employee2.eid= [row objectForKey:@"id"];
        employee2.name= [row objectForKey:@"name"];
        employee2.IMA= [row objectForKey:@"IMA"];
        employee2.address= [row objectForKey:@"address"];
        employee2.sname= [row objectForKey:@"sname"];
        employee2.code= [row objectForKey:@"code"];
        employee2.smphone= [row objectForKey:@"smphone"];
        employee2.email= [row objectForKey:@"email"];
        employee2.username= [row objectForKey:@"username"];
        employee2.smedic= [row objectForKey:@"smedic"];
        employee2.phone= [row objectForKey:@"phone"];
        employee2.insurer= [row objectForKey:@"insurer"];
        [entries addObject:employee2];
    }
    
    return entries;
}
-(rteleEmployer*)loadDataWithId:(NSString*)eid{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/employer/%@/?token=%@", eid,[defaults valueForKey:@"tokenUser"]]];
    
    SBJsonParser *parser = [[SBJsonParser alloc] init];
    
    NSDictionary* json = [[parser objectWithString:retval] copy];
    //NSLog(@"single-%@",json);
    rteleEmployer *employee2 = [[rteleEmployer alloc] init];
    employee2.eid= [json objectForKey:@"id"];
    employee2.name= [json objectForKey:@"name"];
    employee2.IMA= [json objectForKey:@"IMA"];
    employee2.address= [json objectForKey:@"address"];
    employee2.sname= [json objectForKey:@"sname"];
    employee2.code= [json objectForKey:@"code"];
    employee2.smphone= [json objectForKey:@"smphone"];
    employee2.email= [json objectForKey:@"email"];
    employee2.username= [json objectForKey:@"username"];
    employee2.smedic= [json objectForKey:@"smedic"];
    employee2.phone= [json objectForKey:@"phone"];
    employee2.insurer= [json objectForKey:@"insurer"];
    //NSLog(@"single-%@",employee2.eid);
    
    NSString *detailEmployer = [json objectForKey:@"detailEmployer"];
    NSDictionary *JSON = nil;
    if (![detailEmployer isEqual:[NSNull null]] && detailEmployer) {
        NSError *e = nil;
        JSON =
        [NSJSONSerialization JSONObjectWithData: [[json objectForKey:@"detailEmployer"] dataUsingEncoding:NSUTF8StringEncoding]
                                        options: NSJSONReadingMutableContainers
                                          error: &e];
    }
//    NSError *e = nil;
//    NSDictionary *JSON =
//    [NSJSONSerialization JSONObjectWithData: [[json objectForKey:@"detailEmployer"] dataUsingEncoding:NSUTF8StringEncoding]
//                                    options: NSJSONReadingMutableContainers
//                                      error: &e];
    
    employee2.dictJson = JSON;
    return employee2;
}
@end
