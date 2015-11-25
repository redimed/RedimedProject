//
//  rteleAppDelegate.m
//  telehealth
//
//  Created by Khoa Nguyen on 24/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleAppDelegate.h"
#import "rteleEntry.h"
#import "constants.h"
#import <Security/Security.h>
#import "SBJson.h"

@implementation rteleAppDelegate

@synthesize window = window;

- (void)performLoginIfRequired: (UIViewController<loginDelegate> *) source {
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    NSString *logged = [defaults valueForKey:@"isLoggedIn"];
    if ([logged isEqualToString:@"TRUE"]){
        
    }else{
        //NSLog(@"Is not authed");
        
        UIStoryboard *storyboard = [UIApplication sharedApplication].delegate.window.rootViewController.storyboard;
        
        rteleLoginController *loginController = [storyboard instantiateViewControllerWithIdentifier:@"LoginView"];
        loginController.delegate = source;
        [source presentViewController:loginController animated:YES completion:NULL];
        //[source.view addSubview:loginController.view];
    }
}
- (void)showActivityViewer: (UIViewController *)source withFrame: (CGRect) frame{
   
    
    UIStoryboard *storyboard = [UIApplication sharedApplication].delegate.window.rootViewController.storyboard;
        
    UIViewController *activity = [storyboard instantiateViewControllerWithIdentifier:@"activity"];
    activityView = activity.view;
    activity.view.frame = frame;
    //[activityView setNeedsLayout];
    [source.view insertSubview:activity.view atIndex:99999];
//    [self performSelector:@selector(hideActivityViewer) withObject:nil afterDelay:7*60];
}

-(void)hideActivityViewer{
    [activityView removeFromSuperview];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    NSLog(@"\nFrameTest: %@",NSStringFromCGRect([[UIScreen mainScreen] bounds]));
    [self appHasNewVersion];

    [[NSUserDefaults standardUserDefaults] setValue:@"0" forKey:@"ssl"];
//    dispatch_queue_t myQueue = dispatch_queue_create("hungcao.getURL", 0);
//    dispatch_async(myQueue, ^{
////        NSURL *URL = [NSURL URLWithString:@"https://docs.google.com/document/d/1pKDS8JmNdk7VeYR5OMy2W2VvFeu3q2RXk0ogtDMEcOQ/edit?usp=sharing"];
//        NSURL *URL = [NSURL URLWithString:@"https://docs.google.com/document/d/1H-EACIgeHAPY05S5bIHX43mVpF7G_UZ3ezV6FCnTWi8/edit?usp=sharing"];
////        NSURL *URL = [NSURL URLWithString:@"https://www.dropbox.com/s/rti44nca16qek3o/server.rtf?dl=0"];
//        //https://docs.google.com/document/d/1WQc-QyH38yDxWS6amO_8fT2Y8ejRyXSCvmXyLZZ8v6c/edit?usp=sharing
//        
//        NSError *error = nil;
//        NSString *stringFromFileAtURL = [[NSString alloc]
//                                         initWithContentsOfURL:URL
//                                         encoding:NSUTF8StringEncoding
//                                         error:&error];
//        
//        
//        if (stringFromFileAtURL) {
//            dispatch_async(dispatch_get_main_queue(), ^{
//                NSArray *arr = [stringFromFileAtURL componentsSeparatedByString:@"s\":\"withURLServer:"];
////                NSArray *arr = [stringFromFileAtURL componentsSeparatedByString:@"http"];
//                NSString *add = [arr objectAtIndex:1];
//                NSArray *arr2 = [add componentsSeparatedByString:@"/\""];
//                NSString *url = [[arr2 objectAtIndex:0] stringByAppendingString:@"/"];
////                NSString *url = [add substringToIndex:55];
//                if (url) {
//                    [[NSUserDefaults standardUserDefaults] setValue:url forKey:@"SERVER_URL"];
//                    NSString *sl = [[NSUserDefaults standardUserDefaults] valueForKey:@"ssl"];
//                    if ([url componentsSeparatedByString:@"https"].count > 1 && !sl) {
//                        [[NSNotificationCenter defaultCenter] postNotificationName:@"handshake" object:nil];
//                    }
//                    NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys:url,@"SERVER_URL", nil];
//                    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
//                    NSString *documentsDirectory = [paths objectAtIndex:0];
//                    NSString *plistPath = [documentsDirectory stringByAppendingPathComponent:@"SERVERURL.plist"];
//                    [dict writeToFile:plistPath atomically:NO];
//                }
//                if (![[NSUserDefaults standardUserDefaults] valueForKey:@"SERVER_URL"]) {
//                    NSDictionary *dict = [NSDictionary dictionaryWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"SERVERURL" ofType:@"plist"]];
//                    [[NSUserDefaults standardUserDefaults] setValue:[dict valueForKey:@"SERVER_URL"] forKey:@"SERVER_URL"];
//                }
//                
//                if (![[NSUserDefaults standardUserDefaults] valueForKey:@"SERVER_URL"]) {
//                    [[NSUserDefaults standardUserDefaults] setValue:SITE_URL_IN_STRING forKey:@"SERVER_URL"];
//                }
//            });
//        }else{
//            NSDictionary *dict = [NSDictionary dictionaryWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"SERVERURL" ofType:@"plist"]];
//            [[NSUserDefaults standardUserDefaults] setValue:[dict valueForKey:@"SERVER_URL"] forKey:@"SERVER_URL"];
//            if (![[NSUserDefaults standardUserDefaults] valueForKey:@"SERVER_URL"]) {
//                [[NSUserDefaults standardUserDefaults] setValue:SITE_URL_IN_STRING forKey:@"SERVER_URL"];
//            }
//        }
//        
//    });
    
    // Override point for customization after application launch.
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    [defaults setValue:@"FALSE" forKey:@"isLoggedIn"];
    
    if (IS_RUNNING_IOS7) {
        [[UINavigationBar appearance] setTintColor:[UIColor whiteColor]];
        [[UIBarButtonItem appearanceWhenContainedIn:[UIToolbar class], nil] setTintColor:[UIColor whiteColor]];
    }
   
    return YES;
}

//NOTE: Force landscape orientation for the whole app
/*- (NSUInteger)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)w {
    return (NSUInteger)[application supportedInterfaceOrientationsForWindow:w] | (1<<UIInterfaceOrientationPortrait);
    
}*/
- (void)connection:(NSURLConnection *)connection
willSendRequestForAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    
    if([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust])
    {
        NSLog(@"Ignoring SSL");
        SecTrustRef trust = challenge.protectionSpace.serverTrust;
        NSURLCredential *cred;
        cred = [NSURLCredential credentialForTrust:trust];
        [challenge.sender useCredential:cred forAuthenticationChallenge:challenge];
        return;
    }
}


- (BOOL)connection:(NSURLConnection *)connection canAuthenticateAgainstProtectionSpace:(NSURLProtectionSpace *)protectionSpace {
    return [protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust];
}

- (void)connection:(NSURLConnection *)connection didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust])
    {
        [challenge.sender useCredential:[NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust] forAuthenticationChallenge:challenge];
    }
    
            
    
    [challenge.sender continueWithoutCredentialForAuthenticationChallenge:challenge];
}

// Hack to avoid iOS6 crash (https://devforums.apple.com/message/731764#731764)
-(NSUInteger)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window
{
    return UIInterfaceOrientationMaskAll;
}
							
- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

//- (BOOL)connection:(NSURLConnection *)connection canAuthenticateAgainstProtectionSpace:(NSURLProtectionSpace *)protectionSpace {
//    return [protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust];
//}
//
//- (void)connection:(NSURLConnection*)connection didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge*)challenge
//{
//    NSLog(@"didReceiveAuthenticationChallenge");
//    if (connectionForServerValidation)
//        [[challenge sender] continueWithoutCredentialForAuthenticationChallenge:challenge];
//    
//    else {
//        if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodClientCertificate])
//        {
//            if (credentialExists)
//                [[challenge sender] useCredential:newCredential forAuthenticationChallenge:challenge];
//            else
//                [[challenge sender] cancelAuthenticationChallenge:challenge];
//        }
//        else if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
//            [challenge.sender useCredential:[NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust] forAuthenticationChallenge:challenge];
//        }
//    }
//}

- (void)appHasNewVersion
{
    dispatch_queue_t myQueue = dispatch_queue_create("hungcao.getVersion", 0);
    dispatch_async(myQueue, ^{
        NSDictionary *bundleInfo = [[NSBundle mainBundle] infoDictionary];
        NSString *bundleIdentifier = [bundleInfo valueForKey:@"CFBundleIdentifier"];
        NSURL *lookupURL = [NSURL URLWithString:[NSString stringWithFormat:@"http://itunes.apple.com/au/lookup?bundleId=%@", bundleIdentifier]];
        NSData *lookupResults = [NSData dataWithContentsOfURL:lookupURL];
        if (lookupResults!=nil) {
            NSDictionary *jsonResults = [NSJSONSerialization JSONObjectWithData:lookupResults options:0 error:nil];
            
            NSUInteger resultCount = [[jsonResults objectForKey:@"resultCount"] integerValue];
            if (resultCount){
                NSDictionary *appDetails = [[jsonResults objectForKey:@"results"] firstObject];
                NSString *latestVersion = [appDetails objectForKey:@"version"];
                NSString *currentVersion = [bundleInfo objectForKey:@"CFBundleShortVersionString"];
                float float1 = [latestVersion floatValue];
                float float2 = [currentVersion floatValue];
                if (![latestVersion isEqualToString:currentVersion] && float2 < float1){
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [[[UIAlertView alloc] initWithTitle:nil message:@"A new version has been uploaded on AppStore.\nPlease update to use REDiSITE app." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
                    });
                }
            }
        }
        
    });
 
}

#pragma mark - UIAlertViewDelegate
-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
//    NSString *iTunesLink = @"itms://itunes.apple.com/us/app/redisite/id568823704?ls=1&mt=8";
//    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:iTunesLink]];
}

@end
