//
//  rteleEntries.m
//  telehealth
//
//  Created by Khoa Nguyen on 28/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleEntries.h"
#import "SBJSON.h"
#import "constants.h"
#import "rteleAppDelegate.h"

@implementation rteleEntries

@synthesize responseData = responseData;
@synthesize entry = entry;

-(NSMutableArray*)loadData:(NSString*)eid{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/entries/%@/?token=%@", eid,[defaults valueForKey:@"tokenUser"]]];
    SBJsonParser *parser = [[SBJsonParser alloc] init];
    
    NSDictionary* json = [[parser objectWithString:retval] copy];
    
    //NSLog(@"%@",responseString);
    /*NSArray* latestLoans = [(NSDictionary*)[responseString JSONValue] objectForKey:@"loans"];
     
     //get latest loan
     NSDictionary* loan = [latestLoans objectAtIndex:0];
     
     //fetch the data
     NSNumber* fundedAmount = [loan objectForKey:@"funded_amount"];
     NSNumber* loanAmount = [loan objectForKey:@"loan_amount"];
     float outstandingAmount = [loanAmount floatValue] - [fundedAmount floatValue];
     
     NSString* name = [loan objectForKey:@"name"];
     NSString* country = [(NSDictionary*)[loan objectForKey:@"location"] objectForKey:@"country"];
     
     //set the text to the label
     //NSLog(@"%@",[NSString stringWithFormat:@"Latest loan: %@ from %@ needs another $%.2f, please help",
     name,country,outstandingAmount
     ]);
     */
    NSMutableArray* entries = [NSMutableArray arrayWithCapacity:[json count]];
    for (NSDictionary *row in json) {
        rteleEntry *entry2 = [[rteleEntry alloc] init];
        entry2.status = [row objectForKey:@"status"];
        entry2.createdTime = [row objectForKey:@"createdTime"];
        entry2.itype = [row objectForKey:@"itype"];
        entry2.eid = [row objectForKey:@"id"];
        entry2.emid = [row objectForKey:@"employerId"];
        [entries addObject:entry2];
    }
    //NSLog(@"%@", retval);
    return entries;
}
-(rteleEntry*)loadDataWithId:(NSString*)eid{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/entry/%@/?token=%@", eid,[defaults valueForKey:@"tokenUser"]]];
    SBJsonParser *parser = [[SBJsonParser alloc] init];
    
    NSDictionary* json = [[parser objectWithString:retval] copy];
    //NSLog(@"single-%@",json);
    rteleEntry *entry2 = [[rteleEntry alloc] init];
    entry2.status = [json objectForKey:@"status"];
    entry2.eid = [json objectForKey:@"id"];
    entry2.detail = [json objectForKey:@"detail"];
    entry2.emid = [json objectForKey:@"employerId"];
    entry2.itype = [json objectForKey:@"itype"];
    //NSLog(@"single-%@",entry2.eid);
    return entry2;
}
@end
