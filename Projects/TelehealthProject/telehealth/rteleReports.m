//
//  rteleReports.m
//  telehealth
//
//  Created by Khoa Nguyen on 20/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleReports.h"
#import "SBJson.h"
#import "rteleAppDelegate.h"
#import "constants.h"

@implementation rteleReports

@synthesize responseData = responseData;
@synthesize report = report;

-(NSMutableArray*)loadDataWithEntryId: (NSString *)eid{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/entryReports/%@/?token=%@", eid,[defaults valueForKey:@"tokenUser"]]];
    
    SBJsonParser *parser = [[SBJsonParser alloc] init];
    
    NSDictionary* json = [[parser objectWithString:retval] copy];
    //NSLog(@"%@", [userInfo objectAtIndex:0]);
    //NSDictionary *json = [retval JSONValue];
    //NSLog(@"%d", [json count]);
    NSMutableArray* entries = [NSMutableArray arrayWithCapacity:[json count]];
    for (NSDictionary *row in json) {
        rteleReport *ireport = [[rteleReport alloc] init];
        ireport.rid= [row objectForKey:@"id"];
        ireport.eid= [row objectForKey:@"entryId"];
        ireport.createdTime= [row objectForKey:@"createdTime"];
        ireport.updatedTime= [row objectForKey:@"updatedTime"];
        ireport.type= [row objectForKey:@"type"];
        ireport.detail= [row objectForKey:@"detail"];
        [entries addObject:ireport];
        //NSLog(@"%@", [row objectForKey:@"entryId"]);
    }
    
    return entries;
}
@end
