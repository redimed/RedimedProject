//
//  rteleWebserviceManager.h
//  telehealth
//
//  Created by Olivier Voyer on 25/10/2013.
//  Copyright (c) 2013 REDiMED. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void (^BooleanResultBlock)(BOOL succeeded, NSString *retval);

@interface rteleWebserviceManager : NSObject
+ (NSString *)sendSynchronousWebserviceRequest:(NSString *)APIcall showAlert:(BOOL)showAlert jsonData:(BOOL) jsonData;
+ (NSString *)sendSynchronousWebserviceRequest:(NSString *)APIcall jsonData:(BOOL) jsonData;
+ (NSString *)sendSynchronousWebserviceRequest:(NSString *)APIcall; // No Alert
+ (NSString *)sendSynchronousWebserviceRequest:(NSString *)APIcall showAlert:(BOOL)showAlert;

+ (NSString *)sendPOSTDataSynchronousWebserviceRequest:(NSString *)APIcall postData:(NSData *)postData;
+ (NSString *)sendPOSTSynchronousWebserviceRequest:(NSString *)APIcall postData:(NSString *)postDataInString; // No Alert
+ (NSString *)sendPOSTSynchronousWebserviceRequest:(NSString *)APIcall postData:(NSString *)postDataInString showAlert:(BOOL)showAlert;
+ (NSString *)sendRequest:(NSMutableURLRequest *)request showAlert:(BOOL)showAlert jsonData:(BOOL) jsonData;
+(NSURL *) getURL;
@end

